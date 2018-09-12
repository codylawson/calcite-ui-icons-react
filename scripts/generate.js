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

const iconsDefinition = require('@esri/calcite-ui-icons');

// Delete and recreate build folder
if (fs.existsSync(buildPath)) {
  rimraf.sync(buildPath);
}
fs.mkdirSync(buildPath);

// calcite-ui-icons exports a JSON structure of their icons.
// Iterate over that structure and craft React components for each icon.
Object.keys(iconsDefinition.icons).forEach(key => {
  const iconDef = iconsDefinition.icons[key];

  // Make a component name from the icon name
  iconDef.name = key
    .split(/-/g)
    .map(part => {
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('');

  iconDef.fileName = `${iconDef.name}.js`;

  // create first part of file
  let fileContent = `import React from 'react';

const ${
    iconDef.name
  } = ({ color = 'currentColor', size = 24, fill = false, className, children, ...props }) => {
  let classes = 'calcite-icon';
  if (className) classes += \` \${className}\`;
`;

  const sizes = Object.keys(iconDef.filled).sort(); // sort the sizes for use by if...then

  // loop through each size, except the largest one, which will be the default (i.e. no if...then)
  let size, componentSize;

  Object.keys(iconDef.filled)
    .sort()
    .forEach((key, i) => {
      const size = key;
      const largest = i === Object.keys(iconDef.filled).length - 1;

      if (!largest) {
        fileContent += `
    if (size <= ${size}) {
      return (
        <svg {...props} width={size} height={size} fill={color} viewBox="0 0 ${size} ${size}" className={classes}>`;
        if (iconDef.filled) {
          fileContent += `
          {fill ? <path d="${iconDef.filled[key]}" /> : <path d="${
            iconDef.outline[key]
          }" />}`;
        } else {
          fileContent += `
          <path d="${iconDef.outline[key]}" />`;
        }
        fileContent += `
        </svg>
      );
    }
  `;
      } else {
        fileContent += `
    return (
      <svg {...props} width={size} height={size} fill={color} viewBox="0 0 ${size} ${size}" className={classes}>`;
      if (iconDef.filled) {
        fileContent += `
        {fill ? <path d="${iconDef.filled[key]}" /> : <path d="${
          iconDef.outline[key]
        }" />}`;
      } else {
        fileContent += `
        <path d="${iconDef.outline[key]}" />`;
      }
      fileContent += `
      </svg>
    );
  `;
      }
    });

  // Make the subdirectory, if it doesn't exist
  if (!fs.existsSync(buildPath)) {
    fs.mkdirSync(buildPath);
  }

  // Write the component file
  fs.writeFileSync(path.join(buildPath, iconDef.fileName), fileContent);
});
