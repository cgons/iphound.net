interface Props {
  iconName: string;
  className?: string;
}

export default function MatIcon(props: Props) {
  return (
    <span
      className={`material-symbols-outlined relative top-0.5 align-baseline ${props.className}`}
    >
      {props.iconName}
    </span>
  );
}
