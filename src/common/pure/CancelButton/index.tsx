import { LinkStyledButton } from 'legacy/theme'

export type CancelButtonProps = {
  onClick: () => void
}

export function CancelButton({ onClick }: CancelButtonProps) {
  return <LinkStyledButton onClick={onClick}>Cancel order</LinkStyledButton>
}
