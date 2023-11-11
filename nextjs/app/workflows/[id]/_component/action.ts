'use server';

//import { Op } from 'sequelize';
import type { Approver, WorkflowNodeForm } from './form';
import { Workflow, WorkflowApprover, WorkflowNode, sequelize } from '@models';
import { revalidatePath } from 'next/cache';

export async function syncNodes(workflowId: number, formData: WorkflowNodeForm) {
  const { Op } = await require("sequelize");
  // ...
  console.log('server side adtion data', formData);
  const { nodes } = formData;
  const t = await sequelize.transaction();
  try {
    const tran = { transaction: t };

    const ids = nodes.filter((node) => !!node.id).map((node) => node.id) as number[];
    await WorkflowNode.destroy({
      ...tran,
      where: {
        workflowId,
        id: {
          [Op.notIn]: [0, ...ids],
        },
      },
    });

    const flowModel = await Workflow.findByPk(workflowId, {
      ...tran,
      include: {
        association: 'nodes',
      },
    });

    if (!flowModel) throw new Error('Target workflow is not found');

    for (const { id: nodeId, ...node } of nodes) {
      if (!nodeId || !flowModel.nodes || flowModel.nodes.every((n) => n.id !== nodeId)) {
        // 画面で新規追加されたもの、または他のセッションで先に削除されたものをinsert
        // approverも同時に処理
        // NOTE: include 指定しただけではtype解決しなかったため、
        //      WorkflowNodeCreationAttributesにinclude追加したいリレへーションの定義手動追加
        const res = await WorkflowNode.create(
          {
            workflowId,
            nodeLv: node.nodeLv,
            operator: node.operator,
            isReaf: node.isReaf,
            approvers: node.approvers.map((item) => ({
              workflowId,
              approverId: item.approverId,
              orderNo: item.orderNo,
            })),
          },
          { include: [{ as: 'approvers', model: WorkflowApprover }], transaction: t }
        );

        console.log('new node created', res);
      } else {
        const nodeModel = await WorkflowNode.findByPk(nodeId, {
          ...tran,
          include: {
            association: 'approvers',
          },
          order: [
            ['nodeLv', 'ASC'],
            ['approvers', 'orderNo', 'ASC'],
          ],
        });
        if (!nodeModel) {
          throw new Error('update target node is not found');
        }

        // NOTE:事前にnodeModelにsetすると、setした以外のカラムが見れなくなるのでnodeの更新は後でする

        // paramのapproversを更新と新規に分ける
        const [existsApprovers, newApprovers] = node.approvers.reduce(
          (prev, cur) => {
            if (cur.id && nodeModel.approvers?.some((item) => item.id === cur.id)) {
              prev[0].push(cur);
            } else {
              prev[1].push(cur);
            }
            return prev;
          },
          [[], []] as [Approver[], Approver[]]
        );

        // DBに登録済のapproversを更新or削除
        for (const approverModel of nodeModel.approvers || []) {
          const found = existsApprovers.find((item) => item.id === approverModel.id);
          if (found) {
            approverModel.set({ ...found });
            await approverModel.save();
          } else {
            await approverModel.destroy();
          }
        }
        //新規approver
        if (newApprovers.length > 0) {
          await WorkflowApprover.bulkCreate(
            newApprovers.map(({ id, ...approver }) => ({ // idはsetされてても無視する
              ...approver,
              workflowId,
              workflowNodeId: nodeId,
            })),
            tran
          );
        }

        // Nodeを検索してset
        nodeModel.set({ ...node });
        await nodeModel.save();
      }
    }

    await t.commit();

    revalidatePath('/workflows/[id]', 'page');
    return { message: 'Update Nodes' };
  } catch (error) {
    await t.rollback();
    console.log(error);
    throw error;
  }
}
