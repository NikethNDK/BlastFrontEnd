import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './store';
import AuthGuard from './components/auth/AuthGuard';

test('renders auth guard without crashing', () => {
  const { container } = render(
    <Provider store={store}>
      <AuthGuard />
    </Provider>
  );
  expect(container).toBeTruthy();
});
