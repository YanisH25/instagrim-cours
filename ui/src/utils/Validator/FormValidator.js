/**
 *  FormValidator meaning is to wrap a form in which there're Validate components.
 *
 *  Validate components send their input value via the context provided by FormValidator,
 *  through a method called sendInputValue(name, value) taking name as the field name corresponding to the Validate's name props.
 *
 *  Each time the sendInputValue method is called, FormValidator check whether the input corresponds to the configuration.
 *  Right then after, it stores the result in an object which as keys has the fields name and as value a boolean describing whether they're valid.
 *
 *  The object described above is then sent through the getState(formState) method which is passed as a FormValidator's props.
*/

import React, {Component} from 'react';
import PropTypes from 'prop-types';

//  Context through is passed the inputs values.
import {ValidationContext} from './ValidationContext';
import Validator from './../validation/validation';

//  Gets the context provider.
const {Provider} = ValidationContext;

/**
 *  The default context value,
 *  Indeed it won't change.
 * 
 *  It is a factory function that takes the setState method of the component.
 *  Returns a new function.
 * 
 *  It allows the Validate components down the tree to communicate with the parent FormValidator.
 *  It takes a name, which is the Validate component name passed as the props name.
 *  The value is the input value thus a string. 
 * 
 *  Don't take heed of the setState parameter, 
 *  just here to make this method a pure function and make it work universally.
 */
const createContextValue = setState => (name, value) => {
    setState({
        fields: {
            [name]: value
        }
    });
};

/**
 *  validateAllInputs(inputs, configuration) takes inputs as an object with their field's name as key and their value as value.
 *  Returns the same object but the values are now booleans representing the validity of the inputs.
 */
const validateAllInputs = (inputs, configuration) => {
    //  Is the returned object.
    //  It maps the inputs' name to a boolean representing the validity of them.
    const mapInputsToBoolean = {};
    
    //  A Validator instance.
    //  Serves to validate the input (see: ../validation/validation.js). 
    const validator = new Validator();

    //  Loop through all the inputs and assigns them a boolean.
    //  The boolean comes from the validate method (see: ../validation/validation.js).
    for (input in inputs) {
        mapInputsToBoolean[input] = validator.validate(inputs[input], configuration[input]);
    }

    return mapInputsToBoolean;
};

/**
 *  validateForm(mapInputsToBoolean) takes an object mapping the inputs' name to their validity boolean.
 *  Returns a boolean, true if all inputs are valid and false if not. 
 */
const validateForm = (mapInputsToBoolean) => {
    //  Takes the keys and uses the array helper every() to test if all inputs are valid.
    return Object.keys(mapInputsToBoolean).every(key => mapInputsToBoolean[key]);
};

/**
 *  It takes as props:
 *      - configuration: an object containing the fields' name with their configuration.
 *      - getState(nextState): a function calling each time the fields' state (state here means whether they're valid) changed.
 */
export default class FormValidator extends Component {

    //  Sets statically the types of the props.
    static propTypes = {
        //  Configuration must be an object required.
        configuration: PropTypes.object.isRequired,
        //  Conversely, getState is totally optional albeit useless without it.
        getState: PropTypes.func,
        //  There must be children because without any children it's useless.
        children: PropTypes.node.isRequired
    }

    state = {
        //  Contains the fields input values
        fields = {}
    }

    //  Executes each time the inputs change.
    componentDidUpdate() {
        //  Gets getState from props
        const { getState } = this.props;

        //  Doesn't bother to execute if there is not getState callback provided.
        if (!getState){
            return;
        }

        //  Maps inputs to their validity boolean. 
        const fields = validateAllInputs(this.state.fields, this.props.configuration);

        //  Returns if the whole form is valid according to all the inputs.
        const valid = validateForm(fields);


        //  Just calls the getState callback with the new state.
        getState({
            fields,
            valid
        });
    } 

    render() {
        return (
            <ValidationContext.Provider value={createContextValue(this.setState)}>
                {this.props.children}
            </ValidationContext.Provider>
        );
    }
}