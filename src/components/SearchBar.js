import React from 'react';
import '../styles/SearchBar.css';

// Class-based component for handling search bar inputs and rendering
// the search bar
class SearchBar extends React.Component {
    state = { term: ""};

    onFormSubmit = event => {
        event.preventDefault();

        this.props.onSubmit(this.state.term);
    }

    render(){
        return( 
            <div>
                <form onSubmit={this.onFormSubmit} className="searchForm">
                    <div className="field">
                        <label className="formLabel">Hae aseman nimellä</label>
                        <input 
                            type="text" 
                            value={this.state.term}
                            onChange={(e) => this.setState({term: e.target.value})}>
                        </input>
                    </div>
                </form>
            </div>
        );
    }
}

export default SearchBar;