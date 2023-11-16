import Typography, { TypographyProps } from '@mui/material/Typography';

type Props = Omit<TypographyProps, 'sx'> & {
  value: React.ReactNode;
};
export default function InvalidTypography({ value, ...props }: Props) {
  return (
    <Typography
      variant='caption'
      sx={(theme) => ({ color: theme.palette.error.main })}
      {...props}
    >
      {value}
    </Typography>
  );
}
