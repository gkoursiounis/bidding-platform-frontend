import React, { Component } from 'react'
import DropdownTreeSelect from 'react-dropdown-tree-select'
import isEqual from 'lodash/isEqual'
//https://dowjones.github.io/react-dropdown-tree-select/#/story/prevent-re-render-on-parent-render-hoc

//Container for DropdownTreeSelect (no re-render on parent render)
class DropdownContainer extends Component {
  constructor(props){
    super(props)
    this.state = {
      data: props.data
    }
  }

  componentWillReceiveProps(nextProps) {
    if(!isEqual(nextProps.data, this.state.data)) {
      this.setState({ data: nextProps.data })
    }
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps.data, this.state.data)
  }

  render() {
    const { data, ...rest } = this.props
    return (
      <div className="container" align="center">
        <DropdownTreeSelect data={this.state.data} {...rest} />
      </div>
    )
  }
}


export default DropdownContainer