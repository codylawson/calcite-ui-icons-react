const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const svgPathRegex = /\sd="(.*)"/;
const svgFolderPath = path.resolve(
  __dirname,
  '../node_modules/@esri/calcite-ui-icons/icons'
);
const buildPath = path.resolve(__dirname, '../build');
const publishPath = path.resolve(__dirname, '../publish');

// Delete and recreate build folder
if (fs.existsSync(buildPath)) {
  rimraf.sync(buildPath);
}

fs.mkdirSync(buildPath);

// container for the collected components
const components = {};

const expr = /(.*?)-(\d+)(?=\.svg|-(f).svg)/;

const filesInFolder = fs.readdirSync(svgFolderPath);

for (let svgFile of filesInFolder) {
  // string match method
  const parsedName = svgFile.match(expr);

  const name = parsedName[1]
    .split(/-/g)
    .map(part => {
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('');
  const size = parsedName[2];
  const fill = !!parsedName[3];

  const content = fs.readFileSync(
    path.join(svgFolderPath, svgFile)
  );
  const svgPathMatches = svgPathRegex.exec(content);
  const svgPath = svgPathMatches && svgPathMatches[1];

  // Skip on empty svgPath
  if (!svgPath) continue;

  // check if component already exists
  if (!components[name]) {
    components[name] = {
      name: name + 'Icon',
      fileName: name + 'Icon.js',
      sizes: {}
    };
  }
  // check if size already exists
  if (!components[name].sizes[size]) {
    components[name].sizes[size] = {
      fill: null,
      'no-fill': null
    };
  }
  components[name].sizes[size][fill ? 'fill' : 'no-fill'] = svgPath;
}

// after parsing all files from the folder, loop through each set
const componentNames = Object.keys(components);
for (let componentDef of componentNames) {
  component = components[componentDef];
  const sizes = Object.keys(component.sizes).sort(); // sort the sizes for use by if...then

  // create first part of file
  let fileContent = `import React from 'react';

const ${
    component.name
  } = ({ color = 'currentColor', size = 24, fill = false, className, children, ...props }) => {
  let classes = 'calcite-icon';
  if (className) classes += \` \${className}\`;
`;

  // loop through each size, except the largest one, which will be the default (i.e. no if...then)
  let size, componentSize;
  for (let i = 0; i < sizes.length - 1; i++) {
    size = sizes[i];
    componentSize = component.sizes[size];
    fileContent += `
  if (size <= ${size}) {
    return (
      <svg {...props} width={size} height={size} fill={color} viewBox="0 0 ${size} ${size}" className={classes}>`;
    if (componentSize.fill && componentSize['no-fill']) {
      fileContent += `
        {fill ? <path d="${componentSize.fill}" /> : <path d="${
        componentSize['no-fill']
      }" />}`;
    } else {
      fileContent += `
        <path d="${componentSize.fill || componentSize['no-fill']}" />`;
    }
    fileContent += `
      </svg>
    );
  }
`;
  }

  // add the last/largest size as the default
  size = sizes[sizes.length - 1];
  componentSize = component.sizes[size];
  fileContent += `
  return (
    <svg {...props} width={size} height={size} fill={color} viewBox="0 0 ${size} ${size}" className={classes}>`;
  if (componentSize.fill && componentSize['no-fill']) {
    fileContent += `
      {fill ? <path d="${componentSize.fill}" /> : <path d="${
      componentSize['no-fill']
    }" />}`;
  } else {
    fileContent += `
      <path d="${componentSize.fill || componentSize['no-fill']}" />`;
  }
  fileContent += `
    </svg>
  );
};

export default ${component.name};
`;

  const currentFolder = buildPath;

  // Make the subdirectory, if it doesn't exist
  if (!fs.existsSync(currentFolder)) {
    fs.mkdirSync(currentFolder);
  }

  // Write the component file
  fs.writeFileSync(path.join(currentFolder, component.fileName), fileContent);
}
