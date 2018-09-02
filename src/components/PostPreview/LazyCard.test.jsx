import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import LazyCard from './LazyCard';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <LazyCard
      placeholderHeight="300"
      raise
      className="foo"
    />,
    div
  );
});

describe('Instance of LazyCard', () => {
  let compInstance;

  beforeAll(() => {
    const comp = renderer.create(<LazyCard><div>test</div></LazyCard>);
    compInstance = comp.getInstance();
    compInstance.observer = {
      disconnect: jest.fn()
    }
  });

  it('does nothing if not intersecting', () => {
    compInstance.fill([]);
    expect(compInstance.observer.disconnect.mock.calls.length).toBe(0);
  });

  it('disconnects the observer if intersecting', () => {
    compInstance.fill([{isIntersecting: true}]);
    expect(compInstance.observer.disconnect.mock.calls.length).toBe(1);
  });

});