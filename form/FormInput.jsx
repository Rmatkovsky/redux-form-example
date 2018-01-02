import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _isPlainObject from 'lodash/isPlainObject';
import _isString from 'lodash/isString';
import cl from 'classnames';
import { Tooltip } from 'react-bootstrap';

class FormInput extends Component {
    constructor(props) {
        super(props);

        this.handleBlur = this.handleBlur.bind(this);
    }

    handleBlur(context) {
        const { input: { onBlur }, handleBlur } = this.props;

        onBlur(context);
        if (handleBlur) {
            handleBlur();
        }
    }

    renderServerValidationErrors() {
        const {
            customErrors,
            meta: {
                touched,
                error,
                dirty,
                submitFailed,
            },
            hideErrorTooltip,
            hideCustomErrors,
        } = this.props;

        if (hideErrorTooltip) {
            return true;
        }

        if ((touched && error && dirty) || (submitFailed && error)) {
            return (
                <Tooltip key={error} placement="right" className="in" id="tooltip-right">{error}</Tooltip>
            );
        }

        if (!customErrors || _isPlainObject(customErrors) || hideCustomErrors) {
            return null;
        }

        if (_isString(customErrors)) {
            return (
                <Tooltip key={customErrors} placement="right" className="in" id="tooltip-right">{customErrors}</Tooltip>
            );
        }

        return customErrors.map(err => (
            <Tooltip key={err} placement="right" className="in" id="tooltip-right">{err}</Tooltip>
        ));
    }

    render() {
        const {
            input,
            type,
            className,
            handleFocus,
            disabled,
            turnOnError,
            turnOnSuccess,
            handleKeyDown,
            customErrors,
            meta: { touched, error, dirty, submitFailed },
            ...rest
        } = this.props;
        const inputClassNames = cl({
            [className]: true,
            '-error': (touched && error && dirty) || (submitFailed && error) || customErrors.length,
        });
        const statusClassNames = cl({
            'app-input-status': turnOnError,
            '-success': (touched && dirty && !error && !customErrors.length) && turnOnSuccess,
            '-error': (touched && error && dirty) || (submitFailed && error) || customErrors.length,
        });

        return (
            <div className="app-input-group">
                <span className={statusClassNames} />
                <input
                  {...input}
                  type={type}
                  disabled={disabled}
                  onFocus={handleFocus}
                  onBlur={this.handleBlur}
                  onKeyDown={handleKeyDown}
                  className={inputClassNames}
                  {...rest}
                />
                {
                    this.renderServerValidationErrors()
                }
            </div>
        );
    }
}

FormInput.defaultProps = {
    disabled: false,
    handleFocus: null,
    handleBlur: null,
    handleKeyDown: null,
    className: 'field',
    customErrors: [],
    turnOnError: false,
    turnOnSuccess: true,
    hideErrorTooltip: false,
    hideCustomErrors: false,
};

FormInput.propTypes = {
    input: PropTypes.object.isRequired,
    turnOnError: PropTypes.bool.isRequired,
    turnOnSuccess: PropTypes.bool.isRequired,
    customErrors: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    handleFocus: PropTypes.func,
    handleBlur: PropTypes.func,
    handleKeyDown: PropTypes.func,
    disabled: PropTypes.bool.isRequired,
    meta: PropTypes.object.isRequired,
    hideErrorTooltip: PropTypes.object.isRequired,
    hideCustomErrors: PropTypes.object.isRequired,
};

export default FormInput;
