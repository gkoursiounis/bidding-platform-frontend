import React, { Component } from "react"
import ReactTooltip from "react-tooltip"
import AccountOptions from "./AccountOptions"


class AccountPreview extends Component {
	render() {
		const adminBadge = this.props.account.admin ? <sup className="admin-badge" data-toggle="tooltip" title="Site Admin">[A] </sup> : null
		return (
			<div className="preview">
				<div className="preview-text">
					<div className="preview-title-group">
						
						<div className="bidder">
							<span>
								<a href={`/accounts/${this.props.account.username}`} className="account-name">{adminBadge}{this.props.account.username}</a>
							</span>
							
							<span className="seller-rating-big" data-tip data-for="seller-rating">&nbsp;&nbsp;&#9733;{this.props.account.sellerRating}</span>
							<ReactTooltip id="seller-rating" place="top" type="warning" effect="solid">
								<span>Seller Rating</span>
							</ReactTooltip>
							
							<span className="bidder-rating-big" data-tip data-for="bidder-rating">&nbsp;&nbsp;&#9733;{this.props.account.bidderRating}</span>
							<ReactTooltip id="bidder-rating" place="top" type="success" effect="solid">
								<span>Bidder Rating</span>
							</ReactTooltip>
							
							{this.props.account.address ? <p className="bidder-location-big">{this.props.account.address.locationTitle}</p> : null}
						</div>
						
						<div style={{display: "flex"}}>
							{this.props.account.verified ?
								<p className="account-verified" style={{color: "green"}}>Verified &nbsp;</p>
								: <p className="account-verified" style={{color: "red"}}>Not Verified &nbsp;</p>
							}
							<AccountOptions account={this.props.account} className="preview-menu" history={this.props.history} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default AccountPreview