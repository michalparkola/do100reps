import { Text } from "react-native";

interface Rep {
  id: string;
  user_id: string;
  summary: string;
  created_at: string;
}

interface RepViewProps {
  rep: Rep;
}

export default function RepView({ rep }: RepViewProps) {
  return (
    <>
      <Text style={{ margin: 12 }}>{rep.created_at}</Text>
      <Text style={{ margin: 12 }}>{rep.summary}</Text>
    </>
  );
}
