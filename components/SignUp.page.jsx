import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import FacebookLogin from 'react-facebook-login';
import cl from 'classnames';
import { Link } from 'react-router-dom';

import routes from '../../../constants/routes.constatnt';

import Popup from '../../../components/common/Popup';
import apiConfig from '../../../config/apiConfig';
import FormInput from '../../../components/form/FormInput';

import {
    isNicknameCustom,
    isEmailCustom,
    requiredCustom,
    isPasswordCustom,
} from '../../../utils/validation.helper';

class SignUpPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visiblePopup: this.props.user.isExistEmail,
        };

        this.requiredPasswordRepeat = this.requiredPasswordRepeat.bind(this);
        this.handleClosePopup = this.handleClosePopup.bind(this);
    }

    componentWillUpdate(nextProps) {
        const { visiblePopup } = this.state;
        const { user: { isExistEmail, errorData } } = nextProps;
        const error = (errorData.data ? !!errorData.data.email : false) || isExistEmail;

        if (visiblePopup !== error) {
            this.setState({ visiblePopup: error });
        }

        return nextProps;
    }

    handleClosePopup() {
        const { handleClearStateExistEmail } = this.props;
        this.setState({ visiblePopup: false });
        handleClearStateExistEmail();
    }

    requiredPasswordRepeat(values) {
        const { signupForm } = this.props;

        if (!signupForm) {
            return null;
        }

        if (Object.prototype.hasOwnProperty.call(signupForm, 'values') && signupForm.values.password !== values) {
            return 'Passwords do not match';
        }

        return null;
    }

    render() {
        const {
            user,
            handleSubmit,
            handleFacebook,
            handleIsExistUser,
            handleIsExistEmail,
            handleClearDataState,
        } = this.props;
        const classNamesPopup = cl({
            popup: true,
            hide: !this.state.visiblePopup,
        });
        const classNameBlock = cl({
            hidden: this.state.visiblePopup,
        });

        return (
            <div className="container signup-form">
                <div className="logo" />
                <Popup
                  handleSubmit={this.handleClosePopup}
                  handleCancel={this.handleClosePopup}
                  buttonName="Ok"
                  className={classNamesPopup}
                  hideCancelButton
                >
                    This email is already in use, if you forgot your password
                    please use <Link to={routes.auth.recovery()}>Forgot Password</Link>
                </Popup>
                <div className={classNameBlock}>
                    <FacebookLogin
                      appId={apiConfig.fbApp}
                      autoLoad={0}
                      callback={handleFacebook}
                      textButton="Connect with facebook"
                      cssClass="custom-btn fb"
                    />
                    <span className="border-text" />
                    <Field
                      name="name"
                      type="text"
                      maxLength={256}
                      component={FormInput}
                      customErrors={user.errorData.data ? user.errorData.data.name : []}
                      placeholder="Username"
                      handleBlur={handleIsExistUser}
                      handleKeyDown={handleClearDataState}
                      turnOnError
                      validate={[
                          requiredCustom('Please enter username'),
                          isNicknameCustom('Please use only Latin letters and digits'),
                      ]}
                    />
                    <Field
                      type="text"
                      name="email"
                      className="field"
                      maxLength={256}
                      component={FormInput}
                      placeholder="Email"
                      handleBlur={handleIsExistEmail}
                      customErrors={user.errorData.data ? user.errorData.data.email : []}
                      turnOnError
                      validate={[
                          requiredCustom('Please enter email'),
                          isEmailCustom('Please enter a valid email'),
                      ]}
                    />
                    <Field
                      type="password"
                      name="password"
                      className="field"
                      maxLength={256}
                      component={FormInput}
                      placeholder="Password"
                      turnOnError
                      validate={[
                          requiredCustom('Please enter your password'),
                          isPasswordCustom('Password should be 8 or more characters long with at least 1 digit'),
                      ]}
                    />
                    <Field
                      type="password"
                      name="password_repeat"
                      className="field"
                      maxLength={256}
                      component={FormInput}
                      placeholder="Repeat password"
                      turnOnError
                      validate={[
                          requiredCustom('Please enter your password'),
                      ]}
                    />
                    <br />
                    <br />
                    <button
                      type="submit"
                      className="custom-btn submit"
                      onClick={handleSubmit}
                    >
                        Let&apos;s Start!
                    </button>
                </div>
            </div>
        );
    }
}

SignUpPage.propTypes = {
    user: PropTypes.object.isRequired,
    signupForm: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleFacebook: PropTypes.func.isRequired,
    handleIsExistUser: PropTypes.func.isRequired,
    handleIsExistEmail: PropTypes.func.isRequired,
    handleClearDataState: PropTypes.func.isRequired,
    handleClearStateExistEmail: PropTypes.func.isRequired,
};

SignUpPage.defaultProps = {
    signupForm: {},
};

const initializeForm = reduxForm({
    form: 'signup',
    validate: (values) => {
        const errors = {};

        if (values.password_repeat) {
            if (values.password_repeat !== values.password) {
                errors.password_repeat = 'Passwords do not match';
            }
        }

        return errors;
    },
})(SignUpPage);

export default connect(state => ({ signupForm: state.form.signup }))(initializeForm);
