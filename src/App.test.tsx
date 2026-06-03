import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Sembark logo', async () => {
  render(<App />);
  expect(screen.getByAltText('Sembark Logo')).toBeInTheDocument();
});
