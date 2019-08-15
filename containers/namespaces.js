const k8sApi = require('../kube-api');
const React = require('react');
const importJsx = require('import-jsx');
const NamespacesComponent = importJsx('../components/namespaces');
const { useState, useEffect } = require('react');

const Namespaces = () => {
  const [namespaces, setNamespaces] = useState([]);

  k8sApi.listNamespace().then(response => {
    setNamespaces(response.body.items);
  });
  
  return <NamespacesComponent namespaces={namespaces}/>;
}

module.exports = Namespaces;