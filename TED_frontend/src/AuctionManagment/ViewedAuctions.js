import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import NotAvailable from "../utils/NotAvailable"
import HomeHeader from "../Elements/HomeHeader"
import Navbar from "../Elements/Navbar"
import AuctionManagmentControl from "./AuctionManagmentControl"
import AuctionPreview from "../Auction/AuctionPreview"
import PageWheel from "../Elements/PageWheel"

class ViewedAuctions extends Component {
	constructor() {
		super()
		this.state = {
			auctions: null,
			itemsPerPage: 5,
			currentPage: -1,
			lastPage: "",
		}
	}

	getAuctions(currPage) {
		customRequest("GET", `/user/myHistory?page=${currPage-1}&size=${this.state.itemsPerPage}`)
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			this.setState({
				lastPage: response.data.totalPages,
				currentPage: currPage,
				auctions: response.data.content,
			})
		}).catch(err => {
			displayError(err)
		})
	}

	componentDidMount() {
		const query = new URLSearchParams(window.location.search)
		let currPage = query.get('page')

		if(currPage === null) {
			this.props.history.push("?page=1")
			currPage = 1
		}

		currPage = Number(currPage)
		this.getAuctions(currPage)
	}

	render() {
		if(!AuthHelper.loggedIn()) {
			return (
				<NotAvailable />
			)
		}

		let myAuctions
		if(this.state.auctions) {
			myAuctions = this.state.auctions.map(item => {
				return (
					<AuctionPreview
						key={item.id}
						auction={item}
						history={this.props.history}
					/>
				)
			})
		}
		else {
			myAuctions = []
		}

		return (
			<div>
				<HomeHeader history={this.props.history} />
				<Navbar auctionTab="active" />
				<div className="auction-managment">
					<AuctionManagmentControl history={this.props.history} />
					<div className="auction-managment-myactivity">
						<h2 className="auction-managment-myactivity-title">My {this.state.openClosed} Auctions</h2>
						<div>
							{myAuctions}
							<PageWheel activePage={this.state.currentPage} lastPage={this.state.lastPage} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default ViewedAuctions