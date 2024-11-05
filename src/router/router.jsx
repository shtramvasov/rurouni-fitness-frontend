import { createBrowserRouter } from 'react-router-dom';
import { Dashboard, Login, ExerciseList, ExerciseDetail, Workouts, Programs } from "@pages"
import { ROUTES } from '@constants/routes.constants';

const router = createBrowserRouter([
  {
    path: ROUTES.DASHBOARD.PATH,
    element: <Dashboard />,
  },
  {
    path: ROUTES.EXERCISES.PATH,
    element: <ExerciseList />,
  },
  {
    path: `${ROUTES.EXERCISES.PATH}/:id`,
    element: <ExerciseDetail />,
  },
  {
    path: ROUTES.WORKOUTS.PATH,
    element: <Workouts />,
  },
  {
    path: ROUTES.PROGRAMS.PATH,
    element: <Programs />,
  },
  {
    path: ROUTES.LOGIN.PATH,
    element: <Login />,
  },
]);

export default router;