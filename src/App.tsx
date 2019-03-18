import React, { Component } from 'react';
import LandingPage from './pages/LandingPage/LandingPage';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    {/*Import Bootstrap CSS */}
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossOrigin="anonymous" />
                </header>

                <LandingPage/>
            </div>
        );
    }
}

export default App;
