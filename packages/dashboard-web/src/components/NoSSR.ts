import React from 'react'

export class NoSSR extends React.Component {
  state = {
    isClient: false,
  }

  componentDidMount() {
    this.setState({
      isClient: true,
    })
  }

  render() {
    const { isClient } = this.state
    const { children } = this.props

    return isClient ? children : false
  }
}
