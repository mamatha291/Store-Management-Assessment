import { Navigate, useParams } from 'react-router-dom';

// When navigating directly to /admin/users/:id, redirect to the Users directory with the right-side detail drawer open
function UserDetail() {
  const { id } = useParams();
  return <Navigate to={`/admin/users?userId=${id}`} replace />;
}

export default UserDetail;
