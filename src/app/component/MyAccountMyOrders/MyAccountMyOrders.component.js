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

import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './MyAccountMyOrders.style';

import { MY_ACCOUNT_URL } from 'Route/MyAccount/MyAccount.container';
import TextPlaceholder from 'Component/TextPlaceholder';
import { Link } from 'react-router-dom';
import { formatCurrency } from 'Util/Price';

export const ORDERS_PATH = 'orders-list';

const CREATED_AT = 'created_at';
const GRAND_TOTAL = 'grand_total';
const ID = 'increment_id';
const STATUS_LABEL = 'status_label';
const SHOW_MORE = 'show_more';

class MyAccountMyOrders extends PureComponent {
    static propTypes = {
        getOrderById: PropTypes.func.isRequired,
        getOrderList: PropTypes.func.isRequired,
        getFormattedDate: PropTypes.func.isRequired,
        orderId: PropTypes.string.isRequired,
        orderList: PropTypes.shape({
            items: PropTypes.arrayOf(
                PropTypes.shape({
                    base_order_info: PropTypes.object,
                    order_id: PropTypes.string,
                    order_products: PropTypes.object,
                    payment_info: PropTypes.object,
                    shipping_info: PropTypes.object
                })
            )
        }).isRequired,
        isMobileTab: PropTypes.bool
    };

    static defaultProps = {
        isMobileTab: false
    };

    tableHeadingRow = {
        [ID]: `${__('Order')} №`,
        [CREATED_AT]: __('Date'),
        [STATUS_LABEL]: __('Status Label'),
        [GRAND_TOTAL]: __('Order - Total'),
        [SHOW_MORE]: __('Action')
    };

    constructor(props) {
        super(props);

        this.shownOrderValues = [
            'increment_id',
            'status_label',
            'created_at',
            'grand_total'
        ];

        this.renderOrderTableRow = this.renderOrderTableRow.bind(this);
    }

    componentDidMount() {
        const {
            getOrderList,
            getOrderById,
            isMobileTab,
            orderId
        } = this.props;

        if (isMobileTab) return;

        if (orderId === ORDERS_PATH) {
            getOrderList();
        } else {
            getOrderById(orderId);
        }
    }

    processOrderItem(key, value) {
        if (!this.shownOrderValues.includes(key)) {
            return null;
        }

        switch (key) {
        case CREATED_AT:
            const { getFormattedDate } = this.props;
            const formattedDate = getFormattedDate(value);

            return this.renderOrderTableColumn(key, formattedDate);
        case GRAND_TOTAL:
            const priceString = formatCurrency(value);

            return this.renderOrderTableColumn(key, priceString);
        default:
            return this.renderOrderTableColumn(key, value);
        }
    }

    renderHeading() {
        return (
            <h3
              block="MyAccountMyOrders"
              elem="Heading"
            >
                { __('Order history') }
            </h3>
        );
    }

    renderOrderTable() {
        const { orderList } = this.props;

        const items = orderList.length
            ? orderList
            : Array.from({ length: 7 }, (_, i) => ({ base_order_info: { id: i } }));

        return (
            <ul
              block="MyAccountMyOrders"
              elem="List"
            >
                { this.renderHeadingRow() }
                { items.map(order => this.renderOrderTableRow(order)) }
            </ul>
        );
    }

    renderHeadingRow() {
        const { isMobileTab } = this.props;

        if (isMobileTab) return null;

        return (
            <li
              block="MyAccountMyOrders"
              elem="Row"
            >
                <ul
                  block="MyAccountMyOrders"
                  elem="RowItems"
                  mods={ { type: 'heading' } }
                >
                    { Object.entries(this.tableHeadingRow)
                        .map(([key, value]) => this.renderOrderTableColumn(key, value, 'heading')) }
                </ul>
            </li>
        );
    }

    renderOrderTableRow(order) {
        const {
            base_order_info: { id },
            base_order_info
        } = order;

        const isRealOrder = Object.keys(base_order_info).length > 1;

        return (
            <li
              block="MyAccountMyOrders"
              elem="Row"
              key={ id }
            >
                <ul
                  block="MyAccountMyOrders"
                  elem="RowItems"
                >
                    { isRealOrder
                        ? Object.entries(base_order_info)
                            .map(([key, value]) => this.processOrderItem(key, value))
                        : this.shownOrderValues.map((_, i) => this.renderOrderTableColumn(i, null, 'heading')) }
                    { this.renderShowMoreLink(id, isRealOrder) }
                </ul>
            </li>
        );
    }

    renderOrderTableColumn(key, value, type = null) {
        return (
            <li
              block="MyAccountMyOrders"
              elem="Column"
              mods={ { type: key } }
              key={ key }
            >
                <div
                  block="MyAccountMyOrders"
                  elem="ColumnContent"
                  mods={ { type } }
                >
                    <span block="MyAccountMyOrders" elem="MobileColumnHeading">
                        { value && `${this.tableHeadingRow[key]}: ` }
                    </span>
                    { value || <TextPlaceholder /> }
                </div>
            </li>
        );
    }

    renderShowMoreLink(id, isRealOrder) {
        return (
            <li
              block="MyAccountMyOrders"
              elem="Column"
              mods={ { type: 'more' } }
            >
                { isRealOrder
                    ? (
                        <Link
                          block="MyAccountMyOrders"
                          elem="More"
                          to={ `${MY_ACCOUNT_URL}/${ORDERS_PATH}/${id}` }
                        >
                            { __('Order more') }
                        </Link>
                    )
                    : (
                        <TextPlaceholder />
                    ) }
            </li>
        );
    }

    render() {
        return (
            <div block="MyAccountMyOrders">
                { this.renderHeading() }
                { this.renderOrderTable() }
            </div>
        );
    }
}

export default MyAccountMyOrders;
