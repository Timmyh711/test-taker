import { ContentRenderer } from './ContentRenderer';

interface Props {
  content: string;
  latexEnabled?: boolean;
}

export function ChoiceLabel({ content, latexEnabled = true }: Props) {
  return <ContentRenderer content={content} latexEnabled={latexEnabled} compact />;
}
