const {Router, Route, Link} = ReactRouter;

var parameters = [];
var match = []
var questions = [{ name: "genre",
                 blurb: "What genres do you like?",
                 values: [
                     {label: "Fantasy", value: "fantasy"},
                     {label: "Romance", value: "romance"},
                     {label: "Western", value: "western"}
                 ]
                },
                { name: "age",
                blurb: "What Age would you like?",
                 values: [
                     {label: "YA", value: "ya"},
                     {label: "pg-13", value: "pg13"},
                     {label: "M", value: "m"},

                 ]
                },
              ];

var comicDB = [
  {id: 1, name: 'Saga', genre: ['science fiction', 'romance'], age: 'M'},
  {id: 2, name: 'Pretty Deadly', genre: ['fantasy', 'western']}
];


const App = React.createClass({
  render: function() {
      return (
        <div>
          <h1>Comic Rec: cuz comics r hard</h1>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/Quiz">Take the Quiz</Link></li>
            <li><Link to="/ComicsList">Comics</Link></li>
          </ul>
          {this.props.children}
        </div>
      );
  }
});

const Quiz = React.createClass({
  render: function(){
      return (
        <SurveyApp questions={questions} />
      )
  }
});

var CheckboxInput = React.createClass({
  render: function () {
    return (
        <label>
            <input type="checkbox"
              name={this.props.name}
              checked={this.props.checked}
              onClick={this.handleChange}
              value={this.props.value} />
              {this.props.label}
      </label>
    );
  },
  handleChange: function(e) {
      // Just a little preprocessing before passing upwards
      this.props.handleChange(this.props.index, e.target.checked);
  }
});

var CheckboxInputField = React.createClass({
    render: function() {
        var name = this.props.question.name;
        var that = this;
        var x = -1;
        var mappedInputElements = this.props.question.values.map(function(data, key) {
            x++;
            return (
              <CheckboxInput
                name={name}
                label={data.label}
                index={x}
                key={data.value}
                value={data.value}
                handleChange={that.handleFieldChange} />
            );
        });
        return (
            <div className="inputFieldWrapper">
                <p>{this.props.question.blurb}</p>
                {mappedInputElements}
            </div>
        );
    },
    handleFieldChange: function(elementIndex, elementChecked) {
        // A little more pre-processing, then pass the data upwards again
         this.props.handleFieldChange(this.props.index, elementIndex, elementChecked);

    }
});


var CheckboxInputFields = React.createClass({
    render: function() {
        var that = this;
        var x = -1;
        var mappedInputFields = this.props.questions.map(function(question, key) {
            x++;
            return (
              <CheckboxInputField
                question={question}
                index={x}
                key = {question.name}
                handleFieldChange={that.props.handleFieldChange} />
            );
        });
        return (
            <div>
                {mappedInputFields}
            </div>
        );
    }
});

var SurveyApp = React.createClass({
    getInitialState: function() {
        var questions = this.props.questions.slice();
        return {questions: questions};
    },
    render: function() {
        return (
          <form>
            <CheckboxInputFields
                questions={this.state.questions}
                handleFieldChange={this.handleFieldChange} />

            <br></br>

            <input type="submit"></input>
          </form>

        );
    },
    handleFieldChange: function(questionIndex, elementIndex, checked) {
        // Update the state data.  If the element has been checked, then change the element's
        // corresponding data point's checked property to true.  (This will add the checked
        // property to that data point if it doesn't already exist.)  If the element has been
        // unchecked, then we'll delete that data point's checked element it it exists.

        var newStateQuestions = this.state.questions.slice();
        var elementCheckToUpdate = newStateQuestions[questionIndex].values[elementIndex];
        if(checked) {
            elementCheckToUpdate.checked = true
            parameters.push(elementCheckToUpdate.value);
            var indexPushed = parameters.indexOf(elementCheckToUpdate)
            console.log('User has selected: ', parameters)
        }
        else {
            if(typeof elementCheckToUpdate.checked !== undefined) {
              var indexUncheck = parameters.indexOf(elementCheckToUpdate.value)
              parameters.splice(indexUncheck, 1);
              delete elementCheckToUpdate.checked;
              console.log('User has selected: ', parameters)

            }
        }
        this.setState({questions: newStateQuestions});
    }
});



const ComicsList = React.createClass({
  getInitialState: function(){
    return {data: []};
  },

  componentDidMount: function() {
    $.ajax({
      url: "/comics",
      method: "GET",
      success: function(result) {
        console.log("Result: ", result);
        this.setState({data: result});
      }.bind(this)
    });
  },

  render: function() {
    var comicComponents = this.state.data.map(function(comic){
      return <Comic info={comic}/>;
    });
    return (
      <div>
        <h2>Recommended Comics</h2>
          <ul>
            <li> {comicComponents} </li>
          </ul>
      </div>
    );
  }
});

const Comic = React.createClass({
  render: function() {
    var titleParam = this.props.info.name.replace(/\s/g, '+');
    let comicPath = '/ComicsList/'+titleParam;

    return (
      <li>
        <Link to={comicPath}>
          <h3>{this.props.info.name}</h3>
          <img src="https://placekitten.com/g/350/150"></img>
            </Link>
        <p> Description of the comic shortened here...</p>
      </li>
    )
  }
});

/* Show selected comic's detailed info */
const ComicInfo = React.createClass({

  getInitialState: function() {
    return {comic: null};
  },

  loadComicsData: function () {
    $.ajax({
      url: 'http://www.comicvine.com/api/issue/4000-360829/?api_key=&format=jsonp&json_callback=?',
      method: 'GET',
      dataType: 'jsonp',
      success: function(result) {
            this.setState({comic: result});
        }.bind(this)
    });
  },

  componentDidMount: function() {
    this.loadComicsData();
  },

  render: function() {
    var content = this.state.comic ? <div><p>{this.state.comic.results.description}</p><img src="{this.state.comic.results.image.medium_url}"></img></div> : <h2>"Sorry!"</h2>;
      return (
        <div>
          {content}
        </div>
      );
  }
}); /* Comic Info Detail Ends
  <p>{this.state.comic.results.description}</p> */


React.render((
  <Router>
    <Route path="/" component={App}>
        <Route path="/Quiz" component={Quiz}></Route>
        <Route path="/ComicsList/:title" component={ComicInfo}>
        </Route>
        <Route path="/ComicsList" component={ComicsList}>
        </Route>
    </Route>
  </Router>
), document.body);
