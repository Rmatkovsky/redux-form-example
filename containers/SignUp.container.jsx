import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _has from 'lodash/has';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    createUser,
    loginedUser,
    isExistUser,
    isExistEmail,
    clearDataState,
    clearStateExistEmail,
} from '../../actions/user.actions';

import SignUpPage from '../../components/pages/common/SignUp.page';

class SignUpContainer extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
        this.handleIsExistUser = this.handleIsExistUser.bind(this);
        this.handleIsExistEmail = this.handleIsExistEmail.bind(this);
    }

    componentWillMount() {
        const { handleClearDataState } = this.props;

        handleClearDataState();
    }

    handleFacebookLogin(response) {
        const { handleLoginedUser } = this.props;
        const requestData = {
            provider: 'facebook',
            token: response.accessToken,
        };
        handleLoginedUser(requestData);
    }

    handleSubmit(formData) {
        const { handleCreateUser } = this.props;
        handleCreateUser(formData);
    }

    handleIsExistUser() {
        const { handleIsExistUser, form } = this.props;

        if (_has(form, 'values.name')) {
            handleIsExistUser({ name: form.values.name });
        }
    }

    handleIsExistEmail() {
        const { handleIsExistEmail, form } = this.props;

        if (_has(form, 'values.email')) {
            handleIsExistEmail({ email: form.values.email });
        }
    }

    render() {
        const { user, handleClearStateExistEmail, handleClearDataState } = this.props;
        return (
            <SignUpPage
              user={user}
              handleClearStateExistEmail={handleClearStateExistEmail}
              handleClearDataState={handleClearDataState}
              handleFacebook={this.handleFacebookLogin}
              handleIsExistUser={this.handleIsExistUser}
              handleIsExistEmail={this.handleIsExistEmail}
              onSubmit={this.handleSubmit}
            />
        );
    }
}

SignUpContainer.propTypes = {
    user: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    handleCreateUser: PropTypes.func.isRequired,
    handleLoginedUser: PropTypes.func.isRequired,
    handleClearDataState: PropTypes.func.isRequired,
    handleClearStateExistEmail: PropTypes.func.isRequired,
    handleIsExistUser: PropTypes.func.isRequired,
    handleIsExistEmail: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    user: state.user,
    form: state.form.signup,
    // settings: {}, // state.user.settings,
});

const mapDispatchToProps = dispatch => ({
    handleLoginedUser: bindActionCreators(loginedUser, dispatch),
    handleCreateUser: bindActionCreators(createUser, dispatch),
    handleClearDataState: bindActionCreators(clearDataState, dispatch),
    handleClearStateExistEmail: bindActionCreators(clearStateExistEmail, dispatch),
    handleIsExistUser: bindActionCreators(isExistUser, dispatch),
    handleIsExistEmail: bindActionCreators(isExistEmail, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpContainer);
