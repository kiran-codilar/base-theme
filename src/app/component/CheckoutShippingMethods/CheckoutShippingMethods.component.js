/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Field from 'Component/Field';
import Loader from 'Component/Loader';
import './CheckoutShippingMethods.style';

/**
 * Checkout shipping method selector component
 */
class CheckoutShippingMethods extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeMethod: ''
        };
    }

    handleShippingMethodChange(method) {
        const { method_code } = method;
        const { onSelectShippingMethod } = this.props;
        this.setState({ activeMethod: method_code });
        onSelectShippingMethod(method);
    }

    /**
     * Render single row with shipping method
     * @param identifier
     * @param value
     * @returns {*}
     */
    renderShippingMethod(method) {
        const { activeMethod } = this.state;
        const {
            price_incl_tax,
            method_title,
            carrier_title,
            method_code
        } = method;

        console.log(method);

        return (
            <tr key={ method_code } onClick={ () => this.handleShippingMethodChange(method) }>
                <td>
                    <Field
                      id={ method_code }
                      name="shipping_method"
                      type="radio"
                      value={ method_code }
                      checked={ method_code === activeMethod }
                      onChange={ () => this.handleShippingMethodChange(method) }
                    />
                </td>
                <td
                  block="CheckoutShippingMethods"
                  elem="Information"
                >
                    Shipping carrier method:
                    <strong>{ carrier_title }</strong>
                    , price rate
                    <strong>{ method_title }</strong>
                </td>
                <td
                  block="CheckoutShippingMethods"
                  elem="Price"
                >
                    { `${price_incl_tax}$` }
                </td>
            </tr>
        );
    }

    /**
     * Render shipping methods table
     * @returns {*}
     */
    render() {
        const { shippingMethods, loadingShippingMethods } = this.props;
        const areShippingMethodsAvailable = Object.keys(shippingMethods).length;

        return (
            <fieldset block="CheckoutShippingMethods">
                <legend
                  block="CheckoutPage"
                  elem="Heading"
                  mods={ { hasDivider: true } }
                >
                    1. Shipping
                </legend>
                <div>
                    <Loader isLoading={ loadingShippingMethods } />
                    { areShippingMethodsAvailable
                        ? (
                            <table>
                                <tbody>
                                    { shippingMethods.map(method => this.renderShippingMethod(method)) }
                                </tbody>
                            </table>
                        )
                        : (
                            <p>Please enter shipping address information first!</p>
                        )
                    }
                </div>
            </fieldset>
        );
    }
}

CheckoutShippingMethods.propTypes = {
    shippingMethods: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSelectShippingMethod: PropTypes.func.isRequired,
    loadingShippingMethods: PropTypes.bool.isRequired
};

export default CheckoutShippingMethods;
