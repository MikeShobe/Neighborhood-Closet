var React = require('react');


var style = {
  height: 'auto',
	width: '200px'
};


var Images = React.createClass({
  render: function(){
    return(
      <div className="col-xs-12 col-sm-4 text-center">
        <img src={this.props.imgUrl} style={style}/>
      </div>
  )}
});
module.exports = Images;
