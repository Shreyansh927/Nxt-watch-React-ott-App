import React from 'react'

const SavedVideosContext = React.createContext({
  savedVideosList: [],
  darkMode: false,

  toggleInsideDeleteButton: () => {},
  deleteFullList: () => {},
  deleteIndivisualVideo: () => {},
  addVideo: () => {},
  removeVideo: () => {},
})

export default SavedVideosContext
