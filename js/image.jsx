var React = require('react');


var Images = React.createClass({
  render: function(){
    return(
      <div className="col-xs-12 col-sm-4 text-center">
        <img src={this.props.imgUrl}/>
      </div>
  )}
});
module.exports = Images;
