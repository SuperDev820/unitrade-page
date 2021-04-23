import gql from 'graphql-tag'

export const TOKEN_INFO_QUERY = gql`
  query tokens($tokenAddress: Bytes!) {
    tokens(where: { id: $tokenAddress }) {
      id
      symbol
      name
      derivedETH
      totalLiquidity
    }
  }
`

export const TOKEN_IN_OUT_INFO_QUERY = gql`
query tokens($tokenIn: String, $tokenOut: String) {
  tokenIn: token(id: $tokenIn) {
    id
    name
    symbol
    decimals
    derivedETH
  }
  tokenOut: token(id: $tokenOut) {
    id
    name
    symbol
    decimals
    derivedETH
  }
}
`
export const ETH_PRICE_QUERY = gql`
  query ethPrice {
    bundle(id: "1") {
      ethPrice
    }
  }
`
export const FIND_TOKEN_BY_KEY_QUERY = gql`
query tokens($asSymbol: String!, $asAddress: String!, $asName: String!) {
  symbol: tokens(
    where: {symbol_contains: $asSymbol}
    first: 25
    orderBy: txCount
    orderDirection: desc
  ) {
    id
    symbol
    name
    totalLiquidity
    txCount
  }
  name: tokens(
    where: {name_contains: $asName}
    first: 25
    orderBy: txCount
    orderDirection: desc
  ) {
    id
    name
    symbol
    totalLiquidity
    txCount
  }
  addresses: tokens(
    where: {id: $asAddress}
    first: 25
    orderBy: txCount
    orderDirection: desc
  ) {
    id
    name
    symbol
    totalLiquidity
    txCount
  }
  address: token(id: $asAddress) {
    id
    symbol
    name
  }
}
`
export const FIND_PAIR_BY_ADDR_QUERY = gql`
query pairs($token0: String, $token1: String) {
  pair: pairs(where: {token0: $token0, token1: $token1}, first: 20) {
    id
    token0 {
      id
      symbol
      name
      decimals
    }
    token1 {
      id
      symbol
      name
      decimals
    }
    token0Price
    token1Price
    reserve0
    reserve1
  }
  inverse: pairs(where: {token0: $token1, token1: $token0}, first: 20) {
    id
    token0 {
      id
      symbol
      name
      decimals
    }
    token1 {
      id
      symbol
      name
      decimals
    }
    token0Price
    token1Price
    reserve0
    reserve1
  }
}
`

export const FIND_PAIR_BY_TOKEN1_QUERY = gql`
query pairs($addr1: Bytes!) {
  pairs(first: 20, skip: $skip, orderBy: totalSupply, orderDirection: desc, where: { token1: $addr1}) {
    id
		token0 {
      id
      symbol
      name
      derivedETH
      totalLiquidity
		}
		totalSupply
  }
}
`

export const FIND_PAIR_BY_TOKEN0_QUERY = gql`
query pairs($addr0: Bytes!) {
  pairs(first: 20, skip: $skip, orderBy: totalSupply, orderDirection: desc, where: { token0: $addr0}) {
    id
		token1 {
      id
      symbol
      name
      derivedETH
      totalLiquidity
		}
		totalSupply
  }
}
`
export const FIND_TOKENS_ORDERBY_LIQUIDITY_QUERY = gql`
query tokens($skip: Int!) {
  tokens(first: 10, skip: $skip, orderBy: totalLiquidity, orderDirection: desc, where: {derivedETH_gt:0 }) {
    id
    symbol
    name
    derivedETH
    totalLiquidity
  }
}
`
