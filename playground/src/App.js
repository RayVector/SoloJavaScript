import axios from 'axios'

import {createState, node, rerender} from '../../src'

import Button from './components/Button'
import {addBtnStyles} from './styles/btn'
import TodoItem from './components/TodoItem'
import {onClick, onHover} from "../../src/enum/actions";

import './app.css'
import {createBtn, createContainer} from "../../src/interfaces/interfaces";
import Form from "./components/Form";
import {importComponent} from "../../src/interfaces/interfaces";

const App = () => {
  // state
  const {state, setState, watchField, removeWatcher} = createState({
    count: 0,
    buttonMsg: 'qwe',
    todos: [],
    isAsyncLoading: false,
    isShown: false,
    isShown2: false,
    color: ''
  }, App)

  // watchers
  watchField('isShown', (v) => console.log('isShown: ', v))
  watchField('buttonMsg', (v) => console.log('buttonMsg: ', v))
  watchField('isShown2', (v) => console.log('isShown2: ', v))
  removeWatcher('isShown2')

  // methods
  const fullHideText = () => {
    setState({isShown: !state.isShown})
    // possible way: rerender(state, App)
  }

  const partialHideText = () => {
    setState({isShown2: !state.isShown2})
  }

  const rise = () => {
    setState({count: state.count + 1})
  }

  const updateButtonText = () => {
    setState({buttonMsg: 'qweasdzxc'})
  }

  const undoButtonText = () => {
    setState({buttonMsg: 'qwe'})
  }

  const onTitleHover = () => {
    const getRandomColor = () => {
      let letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
    setState({color: getRandomColor()})
  }

  const getAsyncList = async () => {
    try {
      setState({isAsyncLoading: true})
      setTimeout(async () => {
        const res = await axios.get('https://jsonplaceholder.typicode.com/todos')
        setState({todos: res.data.slice(0, 10)})
        setState({isAsyncLoading: false})
      }, 2000)
    } catch (e) {
      console.error(e)
    }
  }

  // computed
  const computedCountTodos = () => {
    return state.count + state.todos.length
  }

  // lifecycle hook
  const onMounted = () => {
    // possible way: getAsyncList()
  }

  // partials
  const title = () => (
    node({
      el: 'h1',
      classes: ['qwe'],
      attrs: [{id: 'qwe'}],
      styles: {color: state.color, display: 'inline'},
      render: () => ['SJS Hello World!'],
      events: [[onHover, onTitleHover]]
    })
  )

  // view
  const render = () => [
    createContainer([
      title(),
      node({
        el: 'h1',
        render: () => ['Conditional render:'],
      }),
    ], ['container']),
    createContainer([
      createBtn('Full Toggle', fullHideText, [], {marginRight: '5px'}),
      createBtn('Semi Toggle (Hide)', partialHideText)
    ]),
    node({
      el: 'div',
      if: state.isShown,
      render: () => ['I shown']
    }),
    // possible way: state.isShown && createContainer(['I shown']),
    node({
      el: 'div',
      isShown: state.isShown2,
      render: () => ['I shown 2']
    }),
    node({
      el: 'h1',
      render: () => ['Counter:']
    }),
    node({
      el: 'div',
      styles: {
        color: 'green',
        fontSize: '26px'
      },
      render: () => [state.count]
    }),
    node({
      el: 'div',
      styles: {
        marginBottom: '5px',
      },
      render: () => [
        createBtn('+', rise, [], addBtnStyles)
      ]
    }),
    node({
      el: 'h1',
      render: () => ['Props:']
    }),
    node({
      el: 'div',
      render: () => [
        createBtn('update buttons text', updateButtonText),
        createBtn('undo buttons text', undoButtonText)
      ]
    }),
    Button(state.buttonMsg,
      node({
        el: 'div',
        render: () => ['slot'],
        events: [[onClick, () => alert('This is slot')]]
      })
    ),
    node({
      el: 'h1',
      render: () => ['Async list render + props + emits:']
    }),
    createBtn('Get Async List', getAsyncList),
    node({
      el: 'div',
      if: state.isAsyncLoading,
      styles: {marginTop: '20px'},
      render: () => ['...Loading...']
    }),
    createContainer(state.todos.map(todo => TodoItem(todo, (item) => alert(`From emit: ${item.title}`)))),
    node({
      el: 'div',
      if: !state.todos.length && !state.isAsyncLoading,
      styles: {marginTop: '20px'},
      render: () => ['Empty list']
    }),
    node({
      el: 'h1',
      styles: {fontSize: '26px'},
      render: () => [`Computed (counter + async list length): ${computedCountTodos()}`]
    }),
    importComponent(Form)
  ]

  return {
    state,
    render,
    onMounted
  }
}

export default App
