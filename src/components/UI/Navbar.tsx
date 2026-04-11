import { Link, NavLink, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks';

const Navbar = () => {
  const { signedIn, user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      await handleLogout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error: unknown) {
      const message = (error as { message: string }).message;
      toast.error(message);
    }
  };

  return (
    <div className='navbar bg-base-100'>
      <div className='flex-1'>
        <Link to='/' className='btn btn-ghost text-xl'>
          Travel journal
          <span role='img' aria-labelledby='airplane'>
            🛫
          </span>
          <span role='img' aria-labelledby='heart'>
            ❤️
          </span>
        </Link>
      </div>
      <div className='flex-none flex items-center gap-3'>
        {signedIn && user && (
          <span className='text-sm'>
            Welcome back, {user.firstName} {user.lastName}
          </span>
        )}
        <ul className='menu menu-horizontal px-1'>
          <li>
            <NavLink to='/'>Home</NavLink>
          </li>
          {signedIn ? (
            <>
              <li>
                <NavLink to='/create'>Create post</NavLink>
              </li>
              <li>
                <button onClick={onLogout}>Log out</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to='/register'>Register</NavLink>
              </li>
              <li>
                <NavLink to='/login'>Login</NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
