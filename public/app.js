const {Router, Route, Link} = ReactRouter;

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
            console.log(elementIndex)
            parameters.push(elementCheckToUpdate.value);
            var indexPushed = parameters.indexOf(elementCheckToUpdate)
            console.log('element just pushed in at', indexPushed)
            console.log('before', parameters)
        }
        else {
            if(typeof elementCheckToUpdate.checked !== undefined) {
              var indexUncheck = parameters.indexOf(elementCheckToUpdate.value)
              console.log(indexUncheck+" "+elementCheckToUpdate.value)
              parameters.splice(indexUncheck, 1);
              delete elementCheckToUpdate.checked;
              console.log("after ", parameters)

            }
        }
        this.setState({questions: newStateQuestions});
    }
});

var parameters = [];

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


const ComicsList = React.createClass({
  getInitialState: function(){
    return {data: []};
  },

  componentDidMount: function() {
    $.get("/Comics", function(result) {
      if (this.isMounted()) {
        this.setState({
          data: result
        });
      }
    }.bind(this));
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

/*const ComicInfo = React.createClass({
  getInitialState: function() {
    return {comic: {}};
  },

  componentDidMount: function() {
    $.ajax({
      url: 'www.comicvine.com/api'
      method: 'GET',
      data: {name: this.props.params.title},
      success: function(result) {
        this.setState({comic: result});
      }.bind(this)
    });
  },
www.comicvine.com/api/series/?api_key=&filter=name:Saga.json
  render: function(){
    <div>
      <h3>{this.state.?.name}</h3>
      <img src="{this.state.?.image}"></img>
      <p>{this.state.?.description}</p>
    </div>
  }
}) */

React.render((
  <Router>
    <Route path="/" component={App}>
        <Route path="/Quiz" component={Quiz}></Route>
        <Route path="/ComicsList" component={ComicsList}>
          <Route path="/ComicsList/:title" component={Comic}>
          </Route>
        </Route>
    </Route>
  </Router>
), document.body);
