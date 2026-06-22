import { AppBar, Button, LinearProgress, Toolbar, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import type { SavedSession } from '../types/test';
import { isAnswered } from '../utils/answers';
import type { Answer } from '../types/test';
import { Timer } from './Timer';

interface Props {
  session: SavedSession;
  onTimerExpire: () => void;
  onTogglePause: () => void;
  onExitHome: () => void;
}

export function TopBar({ session, onTimerExpire, onTogglePause, onExitHome }: Props) {
  const total = session.test.questions.length;
  const answered = session.test.questions.filter((q) =>
    isAnswered(q, session.responses[String(q.q_number)] as Answer | undefined)
  ).length;
  const progress = total > 0 ? (answered / total) * 100 : 0;

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Button
          startIcon={<HomeIcon />}
          onClick={onExitHome}
          color="inherit"
          size="small"
          sx={{ mr: 1 }}
        >
          Home
        </Button>
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary' }} noWrap>
          {session.test.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" aria-label={`${answered} of ${total} questions answered`}>
          {answered} / {total} answered
        </Typography>
        <Timer session={session} onExpire={onTimerExpire} onTogglePause={onTogglePause} />
      </Toolbar>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ height: 3 }}
        aria-label="Test progress"
      />
    </AppBar>
  );
}
