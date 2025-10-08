import { Redirect } from 'expo-router';

export default function Index() {
  // Dès que l’app démarre, on redirige vers /login
  return <Redirect href="/login" />;
}
