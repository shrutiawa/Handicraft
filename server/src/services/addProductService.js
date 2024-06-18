const client = require('../middleware/commercetools');

const createProduct = async (data) => {
  const { categoryId, productTypeId, name, price, color, size, imageUrl, description } = data;

  const productData = {
    productType: {
      id: productTypeId,
      typeId: "product-type"
    },
    categories: [
      {
        typeId: "category",
        id: categoryId
      }
    ],
    name: {
      en: name
    },
    slug: {
      en: `${name.toLowerCase().replace(/\s+/g, '-')}-product`
    },
    masterVariant: {
      sku: `SKU-${Math.floor(Math.random() * 1000)}`,
      prices: [
        {
          value: {
            currencyCode: "INR",
            centAmount: price * 100
          }
        }
      ],
      images: [
        {
          url: imageUrl,
          label: "Master Image",
          dimensions: {
            w: 303,
            h: 197
          }
        }
      ],
      attributes: [
        {
          name: "imageURL",
          value: imageUrl
        },
        {
          name: "color",
          value: color
        },
        {
          name: "Size",
          value: size
        },
        {
          name: "Description",
          value: description
        }
      ]
    }
  };

  try {
    const response = await client.execute({
      uri: '/repurpose/products',
      method: 'POST',
      body: productData
    });
    console.log("service response from adding product", response);

    return response.body;

  } catch (error) {
    console.error('Error posting product to Commercetools:', error.response ? error.response.body : error.message);
    throw new Error('Error posting product to Commercetools');
  }
};

module.exports = {
  createProduct
};
