# ECG Convert

This is a data converter for [terminal-sensor](https://github.com/explooosion/terminal-sensor), this worker will let your data convet to one raw style.

### Installtion

```sh
yarn
```

```sh
yarn dev 
```

### DataType

#### Input File

Generate by [terminal-sensor](https://github.com/explooosion/terminal-sensor)

```js
const csv = [
	{"data":81,"time":"2019-01-25T15:47:12.425"},{"data":310,"time":"2019-01-25T15:47:12.430"},
	// ...
]
export default csv
```

#### Output File

```sh
81
310
295
285
321
307
277
303
297
277
# ...
```

