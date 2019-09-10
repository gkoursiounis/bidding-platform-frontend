import React, { Component } from "react"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import AuctionPreview from "../Auction/AuctionPreview"
import PageWheel from "../Elements/PageWheel"

class AuctionsDisplay extends Component {
	constructor() {
		super()
		this.state = {
			auctions: null,
			itemsPerPage: 5,
			currentPage: -1,
			lastPage: "",
			keepParams: "?",
		}

		this.getAuctions = this.getAuctions.bind(this)
		this.getOpenAuctions = this.getOpenAuctions.bind(this)
		this.getFilteredAuctions = this.getFilteredAuctions.bind(this)
		this.getSearchAuctions = this.getSearchAuctions.bind(this)
	}


	getOpenAuctions(currPage) {
		customRequest("GET", `/item/openAuctions?page=${currPage-1}&size=${this.state.itemsPerPage}`)
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


	getFilteredAuctions(currPage, lowerPrice, higherPrice, locationTitle, description, category) {
		let filterRoute = "search/filters?"
		if(lowerPrice) {
			filterRoute = filterRoute + "lowerPrice=" + lowerPrice + "&"
		}
		if(higherPrice) {
			filterRoute = filterRoute + "higherPrice=" + higherPrice + "&"
		}
		if(locationTitle) {
			filterRoute = filterRoute + "locationTitle=" + locationTitle + "&"
		}
		if(description) {
			filterRoute = filterRoute + "description=" + description + "&"
		}
		if(category) {
			filterRoute = filterRoute + "categoryId=" + category + "&"
		}

		customRequest("GET", `${filterRoute}page=${currPage-1}&size=${this.state.itemsPerPage}`)
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

	getSearchAuctions(currPage, searchText) {
		console.log("currPage: ", currPage)
		console.log("searchText: ", searchText)
		const decodedText = searchText.replace(/%23/g, "#").replace(/%26/g, "&").replace(/%25/g, "%")
		customRequest("PUT", `/search/searchBar?lower=0&upper=10`, decodedText)
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			this.setState({
				lastPage: 0,
				auctions: response.data,
			})
		}).catch(err => {
			displayError(err)
		})
	}


	getAuctions() {
		console.log("getAuctions")
		const query = new URLSearchParams(window.location.search)
		let currPage = query.get("page")

		if(currPage === null) {
			this.props.history.push("?page=1")
			currPage = 1
		}
		currPage = Number(currPage)

		const params = query.toString()
		const pagePos = params.lastIndexOf("&")
		const keepParams = params.slice(0, pagePos+1)
		this.setState({
			keepParams: keepParams,
		})

		const path = this.props.location.pathname
		const pos = path.lastIndexOf("/")
		const type = path.slice(pos+1)
		console.log("type: ", type)

		if(type === "filters") {
			const lowerPrice = query.get("lowerPrice")
			const higherPrice = query.get("higherPrice")
			const locationTitle = query.get("locationTitle")
			const description = query.get("description")
			const category = query.get("category")
			this.getFilteredAuctions(currPage, lowerPrice, higherPrice, locationTitle, description, category)
		}
		else if(type === "search") {
			const searchText = query.get("searchText")
			this.getSearchAuctions(currPage, searchText)
		}
		else {
			this.getOpenAuctions(currPage)
		}
	}

	componentDidUpdate(prevProps) {
        if(this.props.location.pathname !== prevProps.location.pathname || this.props.location.search !== prevProps.location.search) {
            this.getAuctions()
        }
    }

	componentDidMount() {
		this.getAuctions()
	}

	render() {
		
		let auctions
		if(this.state.auctions) {
			auctions = this.state.auctions.map(item => {
				return (
					<AuctionPreview
						key={item.id}
						auction={item}
						history={this.props.history}
					/>
				)
			})

			if(auctions.length === 0) {
				auctions = <div><br />No Auctions</div>
			}
		}
		else if(this.state.auctions === "") {
			auctions = <div>Loading...</div>
		}
		else {
			auctions = <div><br />No Auctions</div>
		}

		
		

		return (
			<div>
				<div className="refresh-button-container">
					<button className="refresh-small" onClick={this.getAuctions}>Refresh</button>
				</div>
				{auctions}
				<PageWheel activePage={this.state.currentPage} lastPage={this.state.lastPage} params={this.state.keepParams} />
			</div>
		)
	}
}


export default AuctionsDisplay