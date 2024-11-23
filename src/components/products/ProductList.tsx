import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
	Grid,
	Container,
	Typography,
	Box,
	Fab,
	CircularProgress,
	TextField,
	InputAdornment,
} from "@mui/material"
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material"
import { ProductCard } from "./ProductCard"
import { ProductDialog } from "./ProductDialog"
import {
	startSocketConnection,
	stopSocketConnection,
	deleteProduct,
	fetchProducts,
} from "../../features/products/productsSlice" // Assurez-vous d'importer fetchProducts
import type { AppDispatch, RootState } from "../../app/store"
import { Product } from "../../types/product"

export const ProductList = () => {
	const dispatch = useDispatch<AppDispatch>()
	const { products, loading, error } = useSelector(
		(state: RootState) => state.products
	)
	const [searchTerm, setSearchTerm] = useState("")
	const [openDialog, setOpenDialog] = useState(false)
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

	useEffect(() => {
		console.log("Current products state:", products)
		dispatch(fetchProducts())
		dispatch(startSocketConnection())

		return () => {
			dispatch(stopSocketConnection())
		}
	}, [dispatch])

	const handleEdit = (product: Product) => {
		setSelectedProduct(product)
		setOpenDialog(true)
	}

	const handleDelete = async (id: string) => {
		if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
			await dispatch(deleteProduct(id))
		}
	}

	const handleCloseDialog = () => {
		setSelectedProduct(null)
		setOpenDialog(false)
	}

	// Vérifiez que products est bien un tableau avant d'appeler filter
	const filteredProducts = Array.isArray(products)
		? products.filter(
				product =>
					product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					product.type.toLowerCase().includes(searchTerm.toLowerCase())
		  )
		: []

	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="80vh"
			>
				<CircularProgress />
			</Box>
		)
	}

	return (
		<Container
			maxWidth="lg"
			sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
		>
			<Box
				sx={{
					position: "sticky",
					top: 64,
					zIndex: 1,
					backgroundColor: "#fff",
					padding: "1rem 0",
					textAlign: "center",
					width: "100%",
				}}
			>
				<Typography variant="h4" component="h1">
					Produits
				</Typography>
				<TextField
					variant="outlined"
					size="small"
					placeholder="Rechercher..."
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						),
					}}
					sx={{
						marginTop: "1rem",
						maxWidth: "400px",
						width: "100%",
					}}
				/>
			</Box>

			{error && <Typography color="error">Erreur: {error}</Typography>}

			<Grid container spacing={4} sx={{ marginTop: "2rem" }}>
				{filteredProducts.map(product => (
					<Grid item key={product.id} xs={12} sm={6} md={4}>
						<ProductCard
							product={product}
							onEdit={handleEdit}
							onDelete={handleDelete}
						/>
					</Grid>
				))}
			</Grid>

			<Fab
				color="primary"
				sx={{ position: "fixed", bottom: 16, right: 16 }}
				onClick={() => setOpenDialog(true)}
			>
				<AddIcon />
			</Fab>

			<ProductDialog
				open={openDialog}
				onClose={handleCloseDialog}
				product={selectedProduct}
			/>
		</Container>
	)
}
