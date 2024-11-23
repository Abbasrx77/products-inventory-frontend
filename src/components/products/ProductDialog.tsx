import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	FormControlLabel,
	Switch,
	Rating,
	Box,
	Typography,
	MenuItem,
} from "@mui/material"
import { Product, CreateProductDto } from "../../types/product"
import {
	addProduct,
	updateProduct,
} from "../../features/products/productsSlice"
import type { AppDispatch } from "../../app/store"

interface ProductDialogProps {
	open: boolean
	onClose: () => void
	product?: Product | null
}

interface UpdateProductDto {
	id: string
	data: Partial<Product>
}

const initialFormState = {
	name: "",
	type: "",
	price: "",
	rating: 0,
	warranty_years: "",
	available: true,
}

const productTypes = [
	"Électronique",
	"Informatique",
	"Téléphonie",
	"Accessoires",
	"Autres",
]

export const ProductDialog = ({
	open,
	onClose,
	product,
}: ProductDialogProps) => {
	const dispatch = useDispatch<AppDispatch>()
	const [formData, setFormData] = useState(initialFormState)
	const [errors, setErrors] = useState<Record<string, string>>({})

	useEffect(() => {
		if (product) {
			setFormData({
				name: product.name,
				type: product.type,
				price: product.price.toString(),
				rating: product.rating,
				warranty_years: product.warranty_years.toString(),
				available: product.available,
			})
		} else {
			setFormData(initialFormState)
		}
	}, [product])

	const validateForm = () => {
		const newErrors: Record<string, string> = {}

		if (!formData.name.trim()) {
			newErrors.name = "Le nom est requis"
		}
		if (!formData.type) {
			newErrors.type = "Le type est requis"
		}
		if (
			!formData.price ||
			isNaN(Number(formData.price)) ||
			Number(formData.price) <= 0
		) {
			newErrors.price = "Le prix doit être un nombre positif"
		}
		if (
			!formData.warranty_years ||
			isNaN(Number(formData.warranty_years)) ||
			Number(formData.warranty_years) < 0
		) {
			newErrors.warranty_years =
				"La garantie doit être un nombre positif ou nul"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateForm()) {
			return
		}

		try {
			const productData: CreateProductDto = {
				name: formData.name,
				type: formData.type,
				price: Number(formData.price),
				rating: formData.rating,
				warranty_years: Number(formData.warranty_years),
				available: formData.available,
			}

			if (product && product.id) {
				console.log("Updating product:", product.id, productData)
				await dispatch(
					updateProduct({
						id: product.id,
						data: productData,
					})
				).unwrap()
			} else {
				await dispatch(addProduct(productData)).unwrap()
			}
			onClose()
		} catch (error) {
			console.error("Failed to save product:", error)
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target
		setFormData(prev => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}))
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: "" }))
		}
	}

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<form onSubmit={handleSubmit}>
				<DialogTitle>
					{product ? "Modifier le produit" : "Ajouter un produit"}
				</DialogTitle>
				<DialogContent>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
						<TextField
							name="name"
							label="Nom du produit"
							value={formData.name}
							onChange={handleChange}
							error={!!errors.name}
							helperText={errors.name}
							fullWidth
						/>

						<TextField
							name="type"
							label="Type de produit"
							select
							value={formData.type}
							onChange={handleChange}
							error={!!errors.type}
							helperText={errors.type}
							fullWidth
						>
							{productTypes.map(type => (
								<MenuItem key={type} value={type}>
									{type}
								</MenuItem>
							))}
						</TextField>

						<TextField
							name="price"
							label="Prix"
							type="number"
							value={formData.price}
							onChange={handleChange}
							error={!!errors.price}
							helperText={errors.price}
							InputProps={{
								startAdornment: "€",
							}}
							fullWidth
						/>

						<Box>
							<Typography component="legend">Note</Typography>
							<Rating
								name="rating"
								value={formData.rating}
								onChange={(_, newValue) => {
									setFormData(prev => ({ ...prev, rating: newValue || 0 }))
								}}
								precision={0.5}
							/>
						</Box>

						<TextField
							name="warranty_years"
							label="Années de garantie"
							type="number"
							value={formData.warranty_years}
							onChange={handleChange}
							error={!!errors.warranty_years}
							helperText={errors.warranty_years}
							fullWidth
						/>

						<FormControlLabel
							control={
								<Switch
									name="available"
									checked={formData.available}
									onChange={handleChange}
									color="primary"
								/>
							}
							label="Disponible"
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>Annuler</Button>
					<Button type="submit" variant="contained" color="primary">
						{product ? "Modifier" : "Ajouter"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	)
}
