import React from 'react';
import Timer from './components/Timer';
import TodoItem from './components/TodoItem';
import TodoInput from './components/TodoInput';
import ClearButton from './components/ClearButton';
import EmptyState from './components/EmptyState';

import './styles/App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.clearCompletedItems = this.clearCompletedItems.bind(this);
    this.startSession = this.startSession.bind(this);
    this.increaseSessionsCompleted = this.increaseSessionsCompleted.bind(this);
    this.toggleItemIsCompleted = this.toggleItemIsCompleted.bind(this);

    this.state = {
      // TODO 1
      items: [],
      nextItemId: 0,
      sessionIsRunning: false,
      itemIdRunning: null,
      numCompletedItems: 0,
    };
  }

  addItem(description) {
    const { nextItemId } = this.state;
    const newItem = {
      // TODO 2: initialize new item object
      id: nextItemId, // a unique id identifying this item
      description: description, // a brief description of the todo item
      sessionsCompleted: 0, // how many times a pomodoro session has been completed
      isCompleted: false, // whether the item has been completed
    };
    this.setState((prevState => ({
      // TODO 2: append new items to list and increase nextItemId by 1
      nextItemId: prevState.nextItemId + 1, 
      items: prevState.items.concat(newItem)
    })));
  }

  clearCompletedItems() {
    // TODO 7
    let items = this.state.items.filter(item => !item.isCompleted);
    this.setState({items: items, numCompletedItems: 0});
    this.endSession();
  }

  increaseSessionsCompleted(itemId) {
    // TODO 5
    let items = this.state.items;
    for (let item of items) {
      if (item.id === itemId) {
        item.sessionsCompleted += 1;
      }
    }
    this.setState({items: items});
  }

  toggleItemIsCompleted(itemId) {
    // TODO 6
    let items = this.state.items;
    let increment = 0;
    for (let item of items) {
      if (item.id === itemId) {
        item.isCompleted = !item.isCompleted;
        increment = item.isCompleted ? 1 : -1;
      }
    }
    this.setState({items: items, numCompletedItems: this.state.numCompletedItems + increment});
  }

  toggleTimer(id) {
    if (!this.state.sessionIsRunning || id !== this.state.itemIdRunning) {
      this.startSession(id);
    } else {
      this.endSession();
    }
  }

  startSession(id) {
    // TODO 4
    this.setState({sessionIsRunning: true, itemIdRunning: id});
  }

  endSession() {
    this.setState({sessionIsRunning: false, itemIdRunning: null});
  }

  render() {
    const {
      items,
      sessionIsRunning,
      itemIdRunning,
      areItemsMarkedAsCompleted,
      numCompletedItems
    } = this.state;

    return (
      <div className="flex-wrapper">
        <div className="container">
          <header>
            <h1 className="heading">Today</h1>
            {(numCompletedItems !== 0) && <ClearButton onClick={this.clearCompletedItems} />}
          </header>
          {/* TODO 4 */}
            { sessionIsRunning && 
              <Timer
                key={itemIdRunning}
                mode="WORK"
                onSessionComplete={() => this.increaseSessionsCompleted(itemIdRunning)}
                autoPlays
              /> }
            <div className="items-container">
            {items.length === 0 ? (
                <EmptyState />
              ) : (
                items.map(item => (
                  <TodoItem 
                    key = {item.id}
                    description = {item.description}
                    sessionsCompleted = {item.sessionsCompleted}
                    isCompleted = {item.isCompleted}
                    startSession = {() => this.toggleTimer(item.id)}
                    toggleIsCompleted = {() => this.toggleItemIsCompleted(item.id)}
                  />
                )
              )
            )}
            </div>
        </div>
        <footer>
          <TodoInput addItem={this.addItem} />
        </footer>
      </div>
    );
  }
}

export default App;
