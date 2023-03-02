import * as React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import BlockIcon from '@mui/icons-material/Block'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import FilterListIcon from '@mui/icons-material/FilterList'
import EditIcon from '@mui/icons-material/ModeEdit'
import { alpha } from '@mui/material/styles'
import { visuallyHidden } from '@mui/utils'
import { Alert, CircularProgress } from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator, isEmpty) {
  if (!isEmpty) {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0])
      if (order !== 0) {
        return order
      }
      return a[1] - b[1]
    })
    return stabilizedThis.map((el) => el[0])
  }
}

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
  } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  if (headCells)
    return (
      <TableHead>
        <TableRow>
          <TableCell padding='checkbox'>
            <Checkbox
              color='primary'
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
          {headCells.map((headCell, index) => (
            <TableCell
              key={headCell[index]}
              align={'left'}
              padding={'normal'}
              sortDirection={orderBy === headCell ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell}
                direction={orderBy === headCell ? order : 'asc'}
                onClick={createSortHandler(headCell)}
              >
                {headCell}
                {orderBy === headCells[index] ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    )
}

export default function EnhancedTable({
  rows,
  isManaged,
  setIsManaged,
  headCells,
  isForAdmins,
  isEmpty,
  isCollections,
  setSelectedCollection,
}) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('_id')
  const [selected, setSelected] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [alertBox, setAlertBox] = React.useState()
  const [errorMessage, setErrorMessage] = React.useState()

  const { t } = useTranslation()

  function handleAdminRequest(e) {
    axios({
      method: 'POST',
      url: 'https://course-project-server.onrender.com/api/users/manage',
      headers: { token: localStorage.getItem('token') },
      data: { method: e.currentTarget.ariaLabel, selected },
    })
      .then((res) => {
        setAlertBox(res.data)
        setSelected([])
        setIsManaged(!isManaged)
      })
      .catch((err) => setErrorMessage(err.response.data))
  }

  function handleRequest(e) {
    if (e.currentTarget.ariaLabel === 'Edit') {
      navigate(`/editItem/${selected[0]}`)
    } else if (e.currentTarget.ariaLabel === 'Delete') {
      axios({
        method: 'GET',
        url: 'https://course-project-server.onrender.com/api/item/delete',
        headers: { token: localStorage.getItem('token') },
        params: { _id: selected },
      }).then(() => {
        setIsManaged(!isManaged)
        navigate(`/collection/${id}`)
      })
    }
  }

  function handleCollectionRequest(e) {
    if (e.currentTarget.ariaLabel === 'Edit') {
      navigate(`/edit/${selected[0]}`)
    } else if (e.currentTarget.ariaLabel === 'Delete') {
      axios({
        method: 'GET',
        url: 'https://course-project-server.onrender.com/api/collection/delete/multiple',
        headers: { token: localStorage.getItem('token') },
        params: { _id: selected },
      }).then(() => setIsManaged(!isManaged))
    }
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n._id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  }

  function EnhancedTableToolbar(props) {
    const { numSelected, isForAdmins, isCollections } = props

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color='inherit'
            variant='subtitle1'
            component='div'
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant='h6'
            id='tableTitle'
            component='div'
          >
            {isCollections ? t('collections') : t('management')}
          </Typography>
        )}

        {numSelected > 0 ? (
          <>
            {isForAdmins ? (
              <>
                <Tooltip
                  title='Delete'
                  itemID='1'
                  onClick={handleAdminRequest}
                  id='delete'
                >
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title='Block or Unblock'
                  onClick={handleAdminRequest}
                  id='block'
                >
                  <IconButton>
                    <BlockIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title='Add to/remove from admin'
                  onClick={handleAdminRequest}
                  id='admin'
                >
                  <IconButton>
                    <AdminPanelSettingsIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip
                  title='Delete'
                  itemID='1'
                  onClick={(e) => {
                    isCollections
                      ? handleCollectionRequest(e)
                      : handleRequest(e)
                  }}
                  id='delete'
                >
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                {numSelected === 1 && (
                  <Tooltip
                    title='Edit'
                    onClick={(e) => {
                      isCollections
                        ? handleCollectionRequest(e)
                        : handleRequest(e)
                    }}
                    id='edit'
                  >
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            )}
          </>
        ) : (
          <Tooltip title='Filter list'>
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    )
  }

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  }

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (name) => selected.indexOf(name) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  return (
    <>
      {headCells && rows ? (
        <>
          {isEmpty && rows.length === 0 ? (
            <p style={{ textAlign: 'center' }}>
              {t('this collection has no items')}
            </p>
          ) : (
            <>
              {headCells && rows ? (
                <Box sx={{ width: '100%' }}>
                  <Paper sx={{ width: '100%', mb: 2 }}>
                    <EnhancedTableToolbar
                      isCollections={isCollections}
                      isForAdmins={isForAdmins}
                      numSelected={selected.length}
                      isEmpty={isEmpty}
                    />
                    <TableContainer>
                      <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby='tableTitle'
                        size={dense ? 'small' : 'medium'}
                      >
                        <EnhancedTableHead
                          numSelected={selected.length}
                          order={order}
                          orderBy={orderBy}
                          onSelectAllClick={handleSelectAllClick}
                          onRequestSort={handleRequestSort}
                          rowCount={rows.length}
                          headCells={headCells}
                        />
                        <TableBody>
                          {stableSort(
                            rows,
                            getComparator(order, orderBy),
                            isEmpty
                          )
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row, index) => {
                              const isItemSelected = isSelected(row._id)
                              const labelId = `enhanced-table-checkbox-${index}`

                              return (
                                <TableRow
                                  hover
                                  onClick={(event) =>
                                    handleClick(event, row._id)
                                  }
                                  role='checkbox'
                                  aria-checked={isItemSelected}
                                  tabIndex={-1}
                                  key={row._id}
                                  selected={isItemSelected}
                                >
                                  <TableCell padding='checkbox'>
                                    <Checkbox
                                      color='primary'
                                      checked={isItemSelected}
                                      inputProps={{
                                        'aria-labelledby': labelId,
                                      }}
                                    />
                                  </TableCell>

                                  {Object.values(row).map((r, i) => (
                                    <TableCell key={i} align='left'>
                                      {r.toString()}
                                    </TableCell>
                                  ))}
                                  {!isForAdmins && (
                                    <TableCell align='left'>
                                      <Link
                                        to={
                                          isCollections
                                            ? `/collection/${row.name}`
                                            : `/item/${row._id}`
                                        }
                                        onClick={() => {
                                          if (isCollections) {
                                            setSelectedCollection(row._id)
                                            setIsManaged(!isManaged)
                                          }
                                        }}
                                      >
                                        {localStorage.getItem('language') ===
                                        'en'
                                          ? `${t('show')} ${
                                              isCollections
                                                ? t('items')
                                                : t('detailed')
                                            }`
                                          : t('detailed')}
                                      </Link>
                                    </TableCell>
                                  )}
                                </TableRow>
                              )
                            })}
                          {emptyRows > 0 && (
                            <TableRow
                              style={{
                                height: (dense ? 33 : 53) * emptyRows,
                              }}
                            >
                              <TableCell colSpan={6} />
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component='div'
                      count={rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Paper>

                  {alertBox && (
                    <>
                      <Alert
                        className='alert_error'
                        onClose={() => {
                          setAlertBox()
                        }}
                      >
                        {alertBox}
                      </Alert>
                    </>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '70vh',
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
            </>
          )}
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '70vh',
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {errorMessage && (
        <Alert
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={() => {
                setErrorMessage()
              }}
            >
              x
            </IconButton>
          }
          className='alert_error'
          severity='error'
        >
          {errorMessage}
        </Alert>
      )}
    </>
  )
}
