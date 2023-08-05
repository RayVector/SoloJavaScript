import axios from 'axios'

import { defineNode, rerender } from '../../../src/index'

import Button from './Button'
import { addBtnStyles } from '../styles/btn'

const App = () => {
  // state
  const state = {
    count: 0,
    buttonMsg: 'qwe',
    todos: [],
    isShown: false
  }

  // methods
  const fullHideText = () => {
    state.isShown = !state.isShown
    rerender(state, App)
  }

  const rise = () => {
    state.count++
    rerender(state, App)
  }

  const updateButtonText = () => {
    state.buttonMsg = 'qweasdzxc'
    rerender(state, App)
  }

  const undoButtonText = () => {
    state.buttonMsg = 'qwe'
    rerender(state, App)
  }

  // computed
  const computedCountTodos = () => {
    return state.count + state.todos.length
  }

  // lifecycle hook
  const onMounted = async () => {
    const res = await axios.get('https://jsonplaceholder.typicode.com/todos')
    state.todos = res.data.slice(0, 10)
    rerender(state, App)
  }

  // view
  const render = () => [
    defineNode({
      el: 'h1',
      content: ['Conditional render:']
    }),
    defineNode({
      el: 'button',
      content: ['Full Toggle'],
      events: [{ name: 'click', do: fullHideText}]
    }),
    defineNode({
      el: 'div',
      if: state.isShown,
      content: ['I shown']
    }),
    defineNode({
      el: 'h1',
      content: ['Counter:']
    }),
    defineNode({
      el: 'div',
      styles: {
        color: 'green',
        fontSize: '26px'
      },
      content: [state.count]
    }),
    defineNode({
      el: 'h1',
      content: ['Props:']
    }),
    defineNode({
      el: 'div',
      styles: {
        marginBottom: '5px',
      },
      content: [
        defineNode({
          el: 'button',
          content: ['+'],
          styles: addBtnStyles,
          events: [{ name: 'click', do: rise }]
        }),
      ]
    }),
    defineNode({
      el: 'div',
      content: [
        defineNode({
          el: 'button',
          content: ['update buttons text'],
          events: [{ name: 'click', do: updateButtonText }]
        }),
        defineNode({
          el: 'button',
          content: ['undo buttons text'],
          events: [{ name: 'click', do: undoButtonText }]
        })
      ]
    }),
    Button(state.buttonMsg),
    Button(state.buttonMsg),
    defineNode({
      el: 'h1',
      content: ['Async list render:']
    }),
    defineNode({
      el: 'div',
      content: state.todos.map(todo => {
        return defineNode({
          el: 'li',
          content: [`${todo.id}) ${todo.title}`],
          styles: {
            marginBottom: '10px',
            cursor: 'pointer'
          },
          events: [{ name: 'click', do: () => alert(todo.title) }]
        })
      })
    }),
    defineNode({
      el: 'h1',
      styles: {
        fontSize: '26px'
      },
      content: [`Computed: ${computedCountTodos()}`]
    }),
  ]

  return {
    state,
    render,
    onMounted
  }
}

export default App
