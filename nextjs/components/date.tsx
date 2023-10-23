import { parseISO, format } from 'date-fns';

type Props = {
  dateString?: string;
};
export default function Date(props: Props) {
  const { dateString } = props;
  const date = dateString && format(parseISO(dateString), 'LLLL d, yyyy');
  return <time dateTime={dateString}>{date}</time>;
}
