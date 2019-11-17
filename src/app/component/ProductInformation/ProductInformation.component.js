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

import media, { PRODUCT_MEDIA } from 'Util/Media';
import Html from 'Component/Html';
import Image from 'Component/Image';
import { ProductType } from 'Type/ProductList';
import ContentWrapper from 'Component/ContentWrapper';
import TextPlaceholder from 'Component/TextPlaceholder';
import ExpandableContent from 'Component/ExpandableContent';

import './ProductInformation.style';

export default class ProductInformation extends PureComponent {
    static propTypes = {
        product: ProductType.isRequired,
        areDetailsLoaded: PropTypes.bool.isRequired,
        attributesWithValues: PropTypes.objectOf(PropTypes.string).isRequired
    };

    renderContentPlaceholder() {
        return (
            <div block="ProductInformation" elem="Placeholder">
                <p>
                    <TextPlaceholder length="paragraph" />
                </p>
            </div>
        );
    }

    renderImage() {
        const { product: { thumbnail: { path = '' } = {} } } = this.props;
        const imageUrl = path && media(path, PRODUCT_MEDIA);

        return (
          <Image
            src={ imageUrl }
            alt="Product image"
            mix={ { block: 'ProductInformation', elem: 'Image' } }
          />
        );
    }

    renderAttributeInfo = ([key, value]) => (
        <Html key={ key } content={ `<strong>${key}:</strong> ${value}<br>` } />
    );

    renderConfigurableAttributesInfo() {
        const {
            attributesWithValues,
            product: { description: { html } = {} }
        } = this.props;

        if (!html || !Object.keys(attributesWithValues).length) return null;

        return (
            <p>
                { Object.entries(attributesWithValues).map(this.renderAttributeInfo) }
            </p>
        );
    }

    renderContent() {
        const { product: { description: { html } = {} } } = this.props;

        return (
            <ExpandableContent
              heading="Product information"
              mix={ { block: 'ProductInformation', elem: 'Content' } }
            >
                { html ? <Html content={ html } /> : this.renderContentPlaceholder() }
                { this.renderConfigurableAttributesInfo() }
            </ExpandableContent>
        );
    }

    render() {
        const {
            product: {
                id,
                description: { html } = {}
            },
            areDetailsLoaded
        } = this.props;

        if (!html && id && areDetailsLoaded) return null;

        return (
            <ContentWrapper
              label="Product information"
              mix={ { block: 'ProductInformation' } }
              wrapperMix={ { block: 'ProductInformation', elem: 'Wrapper' } }
            >
                { this.renderImage() }
                { this.renderContent() }
            </ContentWrapper>
        );
    }
}
