import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Dashboard, Login, ExerciseList, ExerciseDetail, Workouts, Programs, AddWorkout } from "@pages"
import { ROUTES } from '@constants/routes.constants';
import { ContainerWrapper } from '@components';


// Оборачиваем нужные страницы в ContainerWrapper через Layout
function AppLayout() {
  return (
    <ContainerWrapper>
      <Outlet /> 
    </ContainerWrapper>
  );
}

const router = createBrowserRouter([
  {
    element: <AppLayout />, 
    children: [
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
        path: ROUTES.ADD_WORKOUT.PATH,
        element: <AddWorkout />,
      },
    ],
  },
  {
    path: ROUTES.LOGIN.PATH,
    element: <Login />,
  },
])

export default router;