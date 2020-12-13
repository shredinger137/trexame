import React from 'react';
import { badgeData } from "./achievementsData.js";
import { config } from "../config.js";

class Achievements extends React.Component {

    state = {
        badges: [],
        nextBadge: {},
        showNextBadge: false
    }

    componentDidUpdate(prevprops, prevstate) {
        if (prevprops.miles != this.props.miles || prevprops.marathon != this.props.marathon || prevprops.achievements != this.props.achievements || prevprops.challengeId != this.props.challengeId) {
            this.getAllBadges();
        }
    }

    componentDidMount() {
        this.getAllBadges();
        console.log(this.props);
    }


    //I got confused on data structures here
    //The key should be the mile marker? 

    getAllBadges() {
        this.setState({ showNextBadge: false })

        var gotNextBadge = false;

        var allBadges = [];

        var list = this.props.achievements;

        console.log(list);
     
        if (list && Array.isArray(list) == true) {
            for (var badge of list) {

                //each 'badge' is an object
                //each one has keys name, desc, image, mile

                if (badge.distance && badge.distance <= this.props.miles) {
                    allBadges.push(badge);
                } else {
                    if (gotNextBadge == false) {
                        this.setState({ nextBadge: badge, showNextBadge: true });
                        gotNextBadge = true;
                        break;
                    }
                }
                this.setState({ badges: allBadges });


            }
        }
    }

    render() {
        return (
            <div className="badgeGrid">
                {this.state.badges.map(badge =>
                    <div key={badge.name}>
                        <span className="badgeName">{badge.name}</span><br />
                        <img src={`${config.uploadedImagesRoot}/${this.props.challengeId}/${badge.image}`} width="150px" alt={`${badge.name}: ${badge.desc}`}></img>
                        <br />
                        <span className="badgeDescription">{badge.description}</span>
                        <br />
                        <span className="badgeDescription">{badge.distance} Miles</span>
                    </div>
                )}
                {this.state.showNextBadge == true ?
                    <div>
                        <span className="badgeName nextBadge">{this.state.nextBadge.name}</span><br />
                        <img className="nextBadge" src={`${config.uploadedImagesRoot}/${this.props.challengeId}/${this.state.nextBadge.image}`} width="150px" alt={`${this.state.nextBadge.name}: ${this.state.nextBadge.desc}`}></img>
                        <br />
                        <span className="badgeDescription nextBadge">{this.state.nextBadge.description}</span>
                        <br />
                        <span className="badgeDescription">Unlocked at {this.state.nextBadge.distance} Miles</span>
                    </div>
                    :

                    ""

                }




            </div>
        );
    }
}

export default Achievements;
