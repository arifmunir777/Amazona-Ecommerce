import React, { useState, useEffect, useMemo } from 'react';
import { Rate, Comment, Avatar, Form, Button, Input, Card, Typography } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getProduct } from '../../store/actions//productActions';
import { withRouter } from 'react-router-dom';
import Layout from '../../layout/Layout';
import { addToCart } from '../../store/actions/cartActions';
import moment from 'moment'
const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value, addToCart }) => (
  <>
    <Form.Item>
      <TextArea rows={2} style={{ width: 500 }} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        Add Comment
      </Button>
    </Form.Item>
  </>
);

const Product = ({ auth, getProduct, history, match, product }) => {
  const [comment, setComment] = useState('');

  //comment this out if you wnat to stay on this page
  useEffect(() => {
    getProduct(match.params.id, history);
  }, []);

  const onChangeRating = () => {
    auth.isAuthenticated ? console.log('call rating post api here') : history.push('/login');
  };

  const onSubmitComment = () => {


  };

  const productInfo = useMemo(() => (
    <div style={{ marginBottom: 16 }}>
      <Typography.Title level={3}>{product.name}<span style={{ fontSize: 12 }}>&nbsp; By</span> <span style={{ fontSize: 14, color: '#C35600' }}>{product.seller?.storeName}</span></Typography.Title>
      <Typography.Text style={{ fontSize: 16 }}>{product.description}</Typography.Text>
      <Typography.Text strong style={{ fontSize: 14 }}>Brand: {product.brand}</Typography.Text>
      <Typography.Text strong style={{ fontSize: 14 }}>Category: {product.category}</Typography.Text>
      <div>
        <Typography.Text style={{ fontSize: 16 }}>{product.avgRating?.toFixed(1)}{' '}</Typography.Text>
        <Rate disabled allowHalf value={product.avgRating} onChange={onChangeRating} />
        <Typography.Text style={{ fontSize: 16 }}>{` (${product.numRatings})`}</Typography.Text>
      </div>
      <Button type={'link'} style={{ width: '150px', paddingLeft: 0 }} onClick={() => history.push('/seller/' + product.seller.id)}>More from this seller</Button>
    </div>
  ), [product, auth])

  const onAddToCart = () => addToCart(product);
  return (
    <Layout>
      <div
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'flex-start',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', width: '85%', marginTop: 32, marginBottom: 24 }}>
          <div style={{ marginRight: 32 }}>
            <Card style={{ height: '500px', width: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img
                  alt="example"
                  height="auto"
                  width="auto"
                  style={{ maxWidth: '450px', maxHeight: '450px' }}
                  src={product.image || 'https://www.freeiconspng.com/uploads/no-image-icon-4.png'}
                />
              </div>
            </Card>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {productInfo}
            {auth.isAuthenticated ?
              <Button type="primary" style={{ width: '150px' }} onClick={() => onAddToCart()}>Add to Cart</Button> :
              <Button type="primary" style={{ width: '150px' }} onClick={() => history.push('/login')}>Login to Buy</Button>}
          </div>
        </div>
        <div>

          {!auth.isAuthenticated && <Typography.Text style={{ color: "#B12705" }}>* You need to be logged in to leave comment or rate this product.</Typography.Text>}
          <Typography.Title level={3}>Comments</Typography.Title>
          {auth.isAuthenticated && <Comment
            author={<Typography.Text strong>{auth.me?.username}</Typography.Text>}
            avatar={
              <Avatar src={auth.me?.avatar} alt="Han Solo" />
            }
            content={
              <Editor
                // submitting={isSubmittingComment}
                onChange={(e) => setComment(e.target.value)}
                onSubmit={onSubmitComment}
                value={comment}
              />
            }
          />}


          {(product.comments || []).map((x) => (
            <Comment
              author={<Typography.Text strong>{x.user.name}</Typography.Text>}
              avatar={
                <Avatar
                  src={x.user.avatar}
                  alt="Han Solo"
                />
              }
              datetime={moment(x.createdAt).fromNow()}
              content={<Typography.Text>{x.comment}</Typography.Text>}
            />
          ))}
        </div>
      </div>
    </Layout >
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  product: state.product.product,
});

export default compose(withRouter, connect(mapStateToProps, { getProduct, addToCart }))(Product);
