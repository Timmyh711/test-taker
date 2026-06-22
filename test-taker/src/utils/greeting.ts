const USER_NAME = 'Timmy';

export function getGreeting(name: string = USER_NAME): string {
  const hour = new Date().getHours();
  let period: string;
  if (hour < 12) period = 'Good Morning';
  else if (hour < 17) period = 'Good Afternoon';
  else period = 'Good Evening';
  return `${period}, ${name}.`;
}
