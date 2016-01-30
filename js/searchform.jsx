var React = require('react');
var $ = require('jquery');

var SearchForm = React.createClass({
  getInitialState: function () {
    return {
      ids: [],
      images: [],
      itemColor: "",//stick into single Item object
      itemWarmth: "",
      itemPattern: "",
      itemFormality: ""
    }
  },

  onChange: function(e) {
    this.setState({
      itemColor: e.target.itemColor,
      itemPattern: e.target.itemPattern,
      itemWarmth: e.target.itemWarmth,
      itemFormality: e.target.itemFormality
    });
  },

  handle: function (e) {
    var that = this;
    console.log(e);
    e.preventDefault();
    var that = this;
    console.log('update time');
    var temp1 = e.target[0].value;
    var sendObject = {};
    sendObject.category = e.target[0].value;
    sendObject.itemColor = e.target[1].value;
    sendObject.itemWarmth = e.target[2].value;
    sendObject.itemPattern = e.target[3].value;
    sendObject.itemFormality = e.target[4].value;
    console.log(sendObject);

    $.ajax({
      url: '/search',
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify(sendObject),
      success: function(data) {
        this.props.update(data);
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    return(
      <div className="row text-center">
        <div className="col-xs-12 col-md-10 col-md-offset-1">
          <form id="searchForm" encType="multipart/form-data" onSubmit={this.handle} className="form-inline">
            <select name="category" className="form-control">
              <option value="tops">Top</option>
              <option value="bottoms">Bottom</option>
              <option value="shoes">Shoes</option>
              <option value="outerwear">Outerwear</option>
            </select>
            <div className="form-group">
              <input type="text" placeholder="Color" name="itemColor" id="itemColor" className="form-control" />
              <input type="text" placeholder="Warmth" name="itemWarmth" id="itemWarmth" className="form-control" />
              <input type="text" placeholder="Pattern" name="itemPattern" id="itemPattern" className="form-control" />
              <input type="text" placeholder="Formality" name="itemFormality" id="itemFormality" className="form-control" />
            </div>
            <div className="form-group">
              <input type="submit" value="Search"  name="submit" className="btn btn-success" />
            </div>
          </form>
        </div>
      </div>
  )}
});

module.exports = SearchForm;
