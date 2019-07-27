import React, {Component} from "react"
import AddressItem from "./AddressItem"
import "../style.css"


class AddressSuggest extends Component {
	render() {
		return (
			<AddressItem
				label="Address"
				value={this.props.query}
				placeholder="Start typing"
				onChange={this.props.onChange}
			/>
		)
	}
}


export default AddressSuggest