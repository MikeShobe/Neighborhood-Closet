var React = require('react');
var Slider = require('./slider.jsx');
var Form = require('./form.jsx');
var Outfit = require('./outfits.jsx');
var Closet = require('./closet.jsx');
var SearchForm = require('./searchform.jsx');

var Images = React.createClass({//Separate file for images
	render: function () {
		console.log(this.props.imgs.img);
		return (
			<div className="row">
				<div className="col-xs-12">
					<img src={this.props.imgs.img}/>
				</div>
			</div>)
	}
});

var Homepage = React.createClass({

	getInitialState: function () {
		return {
			items: []
		}
	},

	componentDidMount: function () {
		this.setState({items: [shirts1, shirts2, shirts3]})
	},

	updatePage: function (images) {
		this.setState({items: images});
		console.log(this.state.items);
	},

  render: function(){
  	var imgs = this.state.items.map(function(element, index) {
			return (<Images imgs={element} key={index} />);
	});
  	return(
    <div>
    	<Form />
    		<SearchForm update={this.updatePage} />
      <Outfit />
			{imgs}
    </div>

  )}
});

React.render(<Homepage/>, document.getElementById('content'));
