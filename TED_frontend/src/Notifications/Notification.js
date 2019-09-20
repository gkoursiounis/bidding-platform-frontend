import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"

class Notification extends Component {
	constructor() {
		super()
		this.state = {
			type: "unseen",
		}

		this.notificationSeen = this.notificationSeen.bind(this)
		this.handleClick = this.handleClick.bind(this)
	}

	notificationSeen() {
		customRequest("PATCH", `/user/markNotification/${this.props.notification.id}`)
		.then(response => {
			this.setState({
				type: "seen",
			})
		}).catch(err => {
			displayError(err)
		})
	}

	handleClick() {
		//this.notificationSeen()

		if(this.props.notification.message.includes("verified")) {
			AuthHelper.verify()
			customRequest("PATCH", `/user/markNotification/${this.props.notification.id}`)
			.then(response => {
				this.setState({
					type: "seen",
				})
				window.location.reload()
			}).catch(err => {
				displayError(err)
			})
		}

		if(this.props.notification.message.includes("auction")) {
			customRequest("PATCH", `/user/markNotification/${this.props.notification.id}`)
			.then(response => {
				this.setState({
					type: "seen",
				})
				this.props.history.push(`/auctions/${this.props.notification.itemId}`)
			}).catch(err => {
				displayError(err)
			})
			
		}
	}

	componentDidMount() {
		this.setState({
			type: this.props.type,
		})
	}

	render() {
		return (
			<button className={"notification " + this.state.type} onClick={this.handleClick} data-dismiss={this.props.dataDismiss}>
				{this.props.notification.message}
			</button>
		)
	}
}

export default Notification