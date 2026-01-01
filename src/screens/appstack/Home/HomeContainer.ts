export default function useHomeContainer() {
  const onConnect = (platform: string) => {
    console.log(`Connecting to ${platform}`);
  };
  return { onConnect };
}